const baseUrl = import.meta.env.VITE_SERVER_BASE_URL
const songsUrl = import.meta.env.VITE_SONGS_URL
const songLyricsUrl = import.meta.env.VITE_SONG_LYRICS_URL

export async function getSongs(): Promise<Song[]> {
    const response = await fetch(`${baseUrl}${songsUrl}`)
    const data = await response.json()
    return data.songs
}

export async function getSongLyrics(songId: number): Promise<LyricsBySong[]> {
    const response = await fetch(`${baseUrl}${songLyricsUrl}/${songId}`)
    const data = await response.json()
    return data.songLyrics
}

export async function updateSong(
    songId: number,
    payload: { song_title: string; artist_name: string },
): Promise<void> {
    const response = await fetch(`${baseUrl}${songsUrl}/${songId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })

    if (!response.ok) {
        throw new Error("Failed to update song")
    }
}

export async function addSongLyrics(payload: {
    song_id: number
    language: string
    lyrics_text: string
    is_translated: boolean
}): Promise<void> {
    const response = await fetch(`${baseUrl}${songLyricsUrl}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })

    if (!response.ok) {
        throw new Error("Failed to add lyrics")
    }
}

export async function updateSongLyric(
    lyricId: number,
    payload: { lyrics_text: string; is_translated: boolean },
): Promise<void> {
    const response = await fetch(`${baseUrl}${songLyricsUrl}/${lyricId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })

    if (!response.ok) {
        throw new Error("Failed to update lyrics")
    }
}

export async function deleteSong(songId: number): Promise<void> {
    const response = await fetch(`${baseUrl}${songsUrl}/${songId}`, {
        method: "DELETE",
    })

    if (!response.ok) {
        throw new Error("Failed to delete song")
    }
}

export function getExportUrl(): string {
    return `${baseUrl}/api/export`
}
