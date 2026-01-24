import express from "express"
import cors from "cors"
import sqlite3 from "sqlite3"
import { open } from "sqlite"

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
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST"],
    }),
)

app.get("/api/data/songs", async (req, res) => {
    try {
        const db = await openDatabase()
        const songsList = await db.all("SELECT * FROM songs")
        res.json({ songs: songsList })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Database query failed" })
    }
})

app.get("/api/data/lyrics", async (req, res) => {
    try {
        const db = await openDatabase()
        const lyricsList = await db.all("SELECT * FROM lyrics")
        res.json({ lyrics: lyricsList })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Database query failed" })
    }
})

app.get("/api/data/artists", async (req, res) => {
    try {
        const db = await openDatabase()
        const artistsList = await db.all("SELECT * FROM artists")
        res.json({ artists: artistsList })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Database query failed" })
    }
})

app.get("/api/data/albums", async (req, res) => {
    try {
        const db = await openDatabase()
        const albumsList = await db.all("SELECT * FROM albums")
        res.json({ albums: albumsList })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Database query failed" })
    }
})

app.get("/api/data/songLyrics", async (req, res) => {
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

app.get("/api/data/songLyrics/:song_id", async (req, res) => {
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
