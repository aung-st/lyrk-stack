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
            "SELECT s.song_id, s.song_title, l.lyric_id, l.lyrics_text, l.language, l.is_translated FROM songs s INNER JOIN lyrics l on s.song_id=l.song_id WHERE s.song_id=?;",
            [songId],
        )
        res.json({ songLyrics: songLyricsList })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Database query failed" })
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
