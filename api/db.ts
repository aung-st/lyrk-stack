import sqlite3 from "sqlite3"
import { open } from "sqlite"
import { config } from "dotenv"

import type {
    AddSongResult,
    ArtistSongs,
    Song,
    SongLyrics,
    SongLyricsById,
    SongUpdates,
    UpsertLyricsResult,
} from "./types.ts"

import path from "path"
import fs from "fs"
import os from "os"

config()

const SCHEMA = `
CREATE TABLE IF NOT EXISTS artists(artist_id INTEGER NOT NULL PRIMARY KEY, artist_name VARCHAR(100));
CREATE TABLE IF NOT EXISTS albums(album_id INTEGER NOT NULL PRIMARY KEY, album_title VARCHAR(100), release_date INTEGER, artist_id INTEGER NOT NULL, FOREIGN KEY (artist_id) REFERENCES artists (artist_id));
CREATE TABLE IF NOT EXISTS songs(song_id INTEGER NOT NULL PRIMARY KEY, song_title VARCHAR(100), artist_id INTEGER NOT NULL, album_id INTEGER, FOREIGN KEY (artist_id) REFERENCES artists (artist_id), FOREIGN KEY (album_id) REFERENCES albums (album_id));
CREATE TABLE IF NOT EXISTS lyrics(lyric_id INTEGER NOT NULL PRIMARY KEY, song_id INTEGER NOT NULL, language VARCHAR(30) NOT NULL, lyrics_text TEXT NOT NULL, is_translated INTEGER, FOREIGN KEY (song_id) REFERENCES songs (song_id));
`

function resolveDataDir(): string {
    if (process.env.LYRK_DATA_DIR) {
        return process.env.LYRK_DATA_DIR
    }

    const home = os.homedir()
    if (process.platform === "win32") {
        return path.join(
            process.env.APPDATA ?? path.join(home, "AppData", "Roaming"),
            "lyrk-stack",
        )
    }
    if (process.platform === "darwin") {
        return path.join(home, "Library", "Application Support", "lyrk-stack")
    }
    return path.join(
        process.env.XDG_DATA_HOME ?? path.join(home, ".local", "share"),
        "lyrk-stack",
    )
}

const dbPath = path.join(resolveDataDir(), "songbook.db")

async function openDatabase() {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true })
    return open({
        filename: dbPath,
        driver: sqlite3.Database,
    })
}

async function initDatabase() {
    const db = await openDatabase()
    await db.exec(SCHEMA)
    await db.close()
}

export async function getSongs(): Promise<Song[]> {
    const db = await openDatabase()
    return db.all(
        "SELECT s.song_id, s.song_title, s.artist_id, a.artist_name FROM songs s INNER JOIN artists a on s.artist_id=a.artist_id;",
    )
}

export async function getSongLyrics(): Promise<SongLyrics[]> {
    const db = await openDatabase()
    const songLyricsList = await db.all(
        "SELECT s.song_id, s.song_title, l.lyric_id, l.lyrics_text, l.language, l.is_translated FROM songs s INNER JOIN lyrics l on s.song_id=l.song_id;",
    )
    return songLyricsList.map((row) => ({
        ...row,
        is_translated: !!row.is_translated,
    }))
}

export async function getSongLyricsById(
    songId: string,
): Promise<SongLyricsById | null> {
    const db = await openDatabase()
    const song = await db.get(
        "SELECT song_id, song_title FROM songs WHERE song_id=?;",
        [songId],
    )
    if (!song) {
        return null
    }
    const songLyricsList = await db.all(
        "SELECT s.song_id, s.song_title, l.lyric_id, l.lyrics_text, l.language, l.is_translated FROM songs s INNER JOIN lyrics l on s.song_id=l.song_id WHERE s.song_id=?;",
        [songId],
    )
    return {
        songLyrics: songLyricsList.map((row) => ({
            ...row,
            is_translated: !!row.is_translated,
        })),
        song_title: song.song_title,
    }
}

export async function getSongsByArtist(
    artistId: string,
): Promise<ArtistSongs | null> {
    const db = await openDatabase()
    const artist = await db.get(
        "SELECT artist_name FROM artists WHERE artist_id=?;",
        [artistId],
    )
    if (!artist) {
        return null
    }
    const songs = await db.all(
        "SELECT song_id, song_title FROM songs WHERE artist_id=?;",
        [artistId],
    )
    return { artist_name: artist.artist_name, songs }
}

export async function addSong(
    song_title: string,
    artist_name: string,
): Promise<AddSongResult> {
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

    return { song_id: songId }
}

export async function upsertLyrics(
    song_id: number,
    language: string,
    lyrics_text: string,
    is_translated: boolean,
): Promise<UpsertLyricsResult> {
    const db = await openDatabase()
    const normalizedLanguage =
        language.charAt(0).toUpperCase() + language.slice(1).toLowerCase()
    const existingLyrics = await db.get(
        "SELECT lyric_id FROM lyrics WHERE song_id=? AND language=?;",
        [song_id, normalizedLanguage],
    )

    if (existingLyrics) {
        await db.run(
            "UPDATE lyrics SET lyrics_text=?, is_translated=? WHERE lyric_id=?;",
            [lyrics_text, is_translated ? 1 : 0, existingLyrics.lyric_id],
        )
        return { lyric_id: existingLyrics.lyric_id, created: false }
    }

    const result = await db.run(
        "INSERT INTO lyrics (song_id, language, lyrics_text, is_translated) VALUES (?, ?, ?, ?);",
        [song_id, normalizedLanguage, lyrics_text, is_translated ? 1 : 0],
    )
    return { lyric_id: result.lastID!, created: true }
}

export async function updateSong(
    songId: string,
    updates: SongUpdates,
): Promise<boolean> {
    const db = await openDatabase()
    const song = await db.get("SELECT * FROM songs WHERE song_id=?;", [songId])
    if (!song) {
        return false
    }

    if (
        updates.artist_name !== undefined &&
        updates.artist_name !== null &&
        String(updates.artist_name).trim() !== ""
    ) {
        const artist = await db.get(
            "SELECT artist_id FROM artists WHERE artist_name=?;",
            [updates.artist_name],
        )

        let artistId: number
        if (artist) {
            artistId = artist.artist_id
        } else {
            const result = await db.run(
                "INSERT INTO artists (artist_name) VALUES (?);",
                [updates.artist_name],
            )
            artistId = result.lastID!
        }

        await db.run("UPDATE songs SET artist_id=? WHERE song_id=?;", [
            artistId,
            songId,
        ])
    }

    if (
        updates.song_title !== undefined &&
        updates.song_title !== null &&
        String(updates.song_title).trim() !== ""
    ) {
        await db.run("UPDATE songs SET song_title=? WHERE song_id=?;", [
            updates.song_title,
            songId,
        ])
    }

    return true
}

export async function deleteSong(songId: string): Promise<void> {
    const db = await openDatabase()
    await db.run("DELETE FROM lyrics WHERE song_id=?;", [songId])
    await db.run("DELETE FROM songs WHERE song_id=?;", [songId])
}

export async function updateLyrics(
    lyricId: string,
    lyrics_text: string,
    is_translated: boolean,
): Promise<boolean> {
    const db = await openDatabase()
    const lyric = await db.get("SELECT * FROM lyrics WHERE lyric_id=?;", [lyricId])
    if (!lyric) {
        return false
    }
    await db.run(
        "UPDATE lyrics SET lyrics_text=?, is_translated=? WHERE lyric_id=?;",
        [lyrics_text, is_translated ? 1 : 0, lyricId],
    )
    return true
}

export { SCHEMA, dbPath, initDatabase }
