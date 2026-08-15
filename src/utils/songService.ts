const baseUrl = import.meta.env.VITE_SERVER_BASE_URL
const songsUrl = import.meta.env.VITE_SONGS_URL
const songLyricsUrl = import.meta.env.VITE_SONG_LYRICS_URL

export async function getSongs(): Promise<Song[]> {
    const response = await fetch(`${baseUrl}${songsUrl}`)
    const data = (await response.json()) as {
        songs: Song[]
        error?: string
    }

    if (!response.ok) {
        throw new Error(data.error ?? "Failed to fetch songs")
    }

    return data.songs
}

export async function getSongLyrics(
    songId: number,
): Promise<{ songLyrics: LyricsBySong[]; song_title: string | null }> {
    const response = await fetch(`${baseUrl}${songLyricsUrl}/${songId}`)
    const data = (await response.json()) as {
        songLyrics: LyricsBySong[]
        song_title: string | null
        error?: string
    }

    if (!response.ok) {
        throw new Error(data.error ?? "Failed to fetch lyrics")
    }

    return data
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

export async function addSong(payload: {
    song_title: string
    artist_name: string
}): Promise<{ song_id: number }> {
    const response = await fetch(`${baseUrl}${songsUrl}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })

    if (!response.ok) {
        throw new Error("Failed to add song")
    }

    return response.json()
}

export async function getSongsByArtist(artistId: number): Promise<{
    artist_name: string
    songs: { song_id: number; song_title: string }[]
}> {
    const response = await fetch(`${baseUrl}${songsUrl}/artist/${artistId}`)
    const data = (await response.json()) as {
        artist_name: string
        songs: { song_id: number; song_title: string }[]
        error?: string
    }

    if (!response.ok) {
        throw new Error(data.error ?? "Failed to fetch artist")
    }

    return data
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
