import express from "express"
import cors from "cors"
import sqlite3 from "sqlite3"
import { open } from "sqlite"
import { config } from "dotenv"

config()

const songsURL: string = process.env.VITE_SONGS_URL!
const songsLyricsURL: string = process.env.VITE_SONG_LYRICS_URL!
const baseURL: string = process.env.VITE_CLIENT_BASE_URL!

const app = express()
const port = 3001

async function openDatabase() {
    return open({
        filename: "./api/songbook.db",
        driver: sqlite3.Database,
    })
}

app.use(
    cors({
        origin: [baseURL],
        methods: ["GET", "POST"],
    }),
)

app.use(express.json())

app.get(songsURL, async (req, res) => {
    try {
        const db = await openDatabase()
        const songsList = await db.all(
            "SELECT s.song_id, s.song_title, s.artist_id, a.artist_name FROM songs s INNER JOIN artists a on s.artist_id=a.artist_id;",
        )
        res.json({ songs: songsList })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Database query failed" })
    }
})

app.get(songsLyricsURL, async (req, res) => {
    try {
        const db = await openDatabase()
        const songLyricsList = await db.all(
            "SELECT s.song_id, s.song_title, l.lyric_id, l.lyrics_text, l.language, l.is_translated FROM songs s INNER JOIN lyrics l on s.song_id=l.song_id;",
        )
        res.json({ songLyrics: songLyricsList })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Database query failed" })
    }
})

app.get(`${songsLyricsURL}/:song_id`, async (req, res) => {
    const songId = req.params.song_id
    try {
        const db = await openDatabase()
        const songLyricsList = await db.all(
            "SELECT s.song_id, s.song_title, l.lyric_id, l.lyrics_text, l.language, l.is_translated FROM songs s LEFT JOIN lyrics l on s.song_id=l.song_id WHERE s.song_id=?;",
            [songId],
        )
        res.json({ songLyrics: songLyricsList })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Database query failed" })
    }
})

app.get(`${songsURL}/artist/:artist_id`, async (req, res) => {
    const artistId = req.params.artist_id
    try {
        const db = await openDatabase()
        const artist = await db.get(
            "SELECT artist_name FROM artists WHERE artist_id=?;",
            [artistId],
        )

        if (!artist) {
            res.status(404).json({ error: "Artist not found" })
            return
        }

        const songs = await db.all(
            "SELECT song_id, song_title FROM songs WHERE artist_id=?;",
            [artistId],
        )
        res.json({ artist_name: artist.artist_name, songs })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Database query failed" })
    }
})

app.post(songsURL, async (req, res) => {
    const { song_title, artist_name } = req.body
    try {
        const db = await openDatabase()
        const artist = await db.get(
            "SELECT artist_id FROM artists WHERE artist_name=?;",
            [artist_name],
        )

        let artistId: number
        if (artist) {
            artistId = artist.artist_id
        } else {
            const result = await db.run(
                "INSERT INTO artists (artist_name) VALUES (?);",
                [artist_name],
            )
            artistId = result.lastID!
        }

        const existingSong = await db.get(
            "SELECT song_id FROM songs WHERE song_title=? AND artist_id=?;",
            [song_title, artistId],
        )

        let songId: number
        if (existingSong) {
            songId = existingSong.song_id
        } else {
            const result = await db.run(
                "INSERT INTO songs (song_title, artist_id) VALUES (?, ?);",
                [song_title, artistId],
            )
            songId = result.lastID!
        }

        res.status(201).json({ song_id: songId })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Failed to add song" })
    }
})

app.post(songsLyricsURL, async (req, res) => {
    const { song_id, language, lyrics_text, is_translated } = req.body
    const normalizedLanguage =
        language.charAt(0).toUpperCase() + language.slice(1).toLowerCase()
    try {
        const db = await openDatabase()
        const existingLyrics = await db.get(
            "SELECT lyric_id FROM lyrics WHERE song_id=? AND language=?;",
            [song_id, normalizedLanguage],
        )

        if (existingLyrics) {
            await db.run(
                "UPDATE lyrics SET lyrics_text=?, is_translated=? WHERE lyric_id=?;",
                [lyrics_text, is_translated ? 1 : 0, existingLyrics.lyric_id],
            )
            res.status(200).json({ lyric_id: existingLyrics.lyric_id })
        } else {
            const result = await db.run(
                "INSERT INTO lyrics (song_id, language, lyrics_text, is_translated) VALUES (?, ?, ?, ?);",
                [song_id, normalizedLanguage, lyrics_text, is_translated ? 1 : 0],
            )
            res.status(201).json({ lyric_id: result.lastID })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Failed to add lyrics" })
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
