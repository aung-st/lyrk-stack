import express from "express"
import cors from "cors"

import {
    addSong,
    dbPath,
    deleteSong,
    getSongLyrics,
    getSongLyricsById,
    getSongs,
    getSongsByArtist,
    initDatabase,
    updateLyrics,
    updateSong,
    upsertLyrics,
} from "./db.ts"

const songsURL: string = process.env.VITE_SONGS_URL!
const songsLyricsURL: string = process.env.VITE_SONG_LYRICS_URL!
const baseURL: string = process.env.VITE_CLIENT_BASE_URL!

const app = express()
const port = 3001

app.use(
    cors({
        origin: [baseURL],
        methods: ["GET", "POST", "PATCH", "DELETE"],
    }),
)

app.use(express.json())

app.get(songsURL, async (req, res) => {
    try {
        const songs = await getSongs()
        res.json({ songs })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Database query failed" })
    }
})

app.get(songsLyricsURL, async (req, res) => {
    try {
        const songLyrics = await getSongLyrics()
        res.json({ songLyrics })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Database query failed" })
    }
})

app.get(`${songsLyricsURL}/:song_id`, async (req, res) => {
    try {
        const result = await getSongLyricsById(req.params.song_id)
        if (!result) {
            res.status(404).json({ error: "Song not found" })
            return
        }
        res.json(result)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Database query failed" })
    }
})

app.get(`${songsURL}/artist/:artist_id`, async (req, res) => {
    try {
        const result = await getSongsByArtist(req.params.artist_id)
        if (!result) {
            res.status(404).json({ error: "Artist not found" })
            return
        }
        res.json(result)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Database query failed" })
    }
})

app.post(songsURL, async (req, res) => {
    const { song_title, artist_name } = req.body
    try {
        const { song_id } = await addSong(song_title, artist_name)
        res.status(201).json({ song_id })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Failed to add song" })
    }
})

app.post(songsLyricsURL, async (req, res) => {
    const { song_id, language, lyrics_text, is_translated } = req.body
    try {
        const { lyric_id, created } = await upsertLyrics(
            song_id,
            language,
            lyrics_text,
            is_translated,
        )
        res.status(created ? 201 : 200).json({ lyric_id })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Failed to add lyrics" })
    }
})

app.patch(`${songsURL}/:song_id`, async (req, res) => {
    const { song_title, artist_name } = req.body
    try {
        const updated = await updateSong(req.params.song_id, {
            song_title,
            artist_name,
        })
        if (!updated) {
            res.status(404).json({ error: "Song not found" })
            return
        }
        res.status(200).json({ song_id: req.params.song_id })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Failed to update song" })
    }
})

app.delete(`${songsURL}/:song_id`, async (req, res) => {
    try {
        await deleteSong(req.params.song_id)
        res.status(204).send()
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Failed to delete song" })
    }
})

app.patch(`${songsLyricsURL}/:lyric_id`, async (req, res) => {
    const { lyrics_text, is_translated } = req.body
    try {
        if (typeof lyrics_text !== "string" || lyrics_text.trim() === "") {
            res.status(400).json({ error: "lyrics_text is required" })
            return
        }

        const updated = await updateLyrics(
            req.params.lyric_id,
            lyrics_text,
            is_translated,
        )
        if (!updated) {
            res.status(404).json({ error: "Lyric not found" })
            return
        }
        res.status(200).json({ lyric_id: req.params.lyric_id })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Failed to update lyrics" })
    }
})

app.get("/api/export", (req, res) => {
    res.download(dbPath, "songbook.db")
})

async function startServer() {
    await initDatabase()
    app.listen(port, () => {
        console.log(`Listening on port ${port}`)
    })
}

startServer().catch((error) => {
    console.error("Failed to initialize database:", error)
    process.exit(1)
})
