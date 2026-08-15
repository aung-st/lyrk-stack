import express from "express"
import cors from "cors"
import sqlite3 from "sqlite3"
import { open } from "sqlite"
import { config } from "dotenv"

import path from "path"

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
        methods: ["GET", "POST", "PATCH", "DELETE"],
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
        res.json({
            songLyrics: songLyricsList.map((row) => ({
                ...row,
                is_translated: !!row.is_translated,
            })),
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Database query failed" })
    }
})

app.get(`${songsLyricsURL}/:song_id`, async (req, res) => {
    const songId = req.params.song_id
    try {
        const db = await openDatabase()
        const song = await db.get(
            "SELECT song_id, song_title FROM songs WHERE song_id=?;",
            [songId],
        )

        if (!song) {
            res.status(404).json({ error: "Song not found" })
            return
        }

        const songLyricsList = await db.all(
            "SELECT s.song_id, s.song_title, l.lyric_id, l.lyrics_text, l.language, l.is_translated FROM songs s INNER JOIN lyrics l on s.song_id=l.song_id WHERE s.song_id=?;",
            [songId],
        )
        res.json({
            songLyrics: songLyricsList.map((row) => ({
                ...row,
                is_translated: !!row.is_translated,
            })),
            song_title: song.song_title,
        })
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

app.patch(`${songsURL}/:song_id`, async (req, res) => {
    const songId = req.params.song_id
    const { song_title, artist_name } = req.body
    try {
        const db = await openDatabase()
        const song = await db.get("SELECT * FROM songs WHERE song_id=?;", [songId])

        if (!song) {
            res.status(404).json({ error: "Song not found" })
            return
        }

        if (
            artist_name !== undefined &&
            artist_name !== null &&
            String(artist_name).trim() !== ""
        ) {
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

            await db.run("UPDATE songs SET artist_id=? WHERE song_id=?;", [
                artistId,
                songId,
            ])
        }

        if (
            song_title !== undefined &&
            song_title !== null &&
            String(song_title).trim() !== ""
        ) {
            await db.run("UPDATE songs SET song_title=? WHERE song_id=?;", [
                song_title,
                songId,
            ])
        }

        res.status(200).json({ song_id: songId })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Failed to update song" })
    }
})

app.delete(`${songsURL}/:song_id`, async (req, res) => {
    const songId = req.params.song_id
    try {
        const db = await openDatabase()
        await db.run("DELETE FROM lyrics WHERE song_id=?;", [songId])
        await db.run("DELETE FROM songs WHERE song_id=?;", [songId])
        res.status(204).send()
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Failed to delete song" })
    }
})

app.patch(`${songsLyricsURL}/:lyric_id`, async (req, res) => {
    const lyricId = req.params.lyric_id
    const { lyrics_text, is_translated } = req.body
    try {
        if (typeof lyrics_text !== "string" || lyrics_text.trim() === "") {
            res.status(400).json({ error: "lyrics_text is required" })
            return
        }

        const db = await openDatabase()
        const lyric = await db.get("SELECT * FROM lyrics WHERE lyric_id=?;", [
            lyricId,
        ])

        if (!lyric) {
            res.status(404).json({ error: "Lyric not found" })
            return
        }

        await db.run(
            "UPDATE lyrics SET lyrics_text=?, is_translated=? WHERE lyric_id=?;",
            [lyrics_text, is_translated ? 1 : 0, lyricId],
        )
        res.status(200).json({ lyric_id: lyricId })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Failed to update lyrics" })
    }
})

app.get("/api/export", (req, res) => {
    const dbPath = path.resolve("./api/songbook.db")
    res.download(dbPath, "songbook.db")
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
