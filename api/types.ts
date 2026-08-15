export type Song = {
    song_id: number
    song_title: string
    artist_id: number
    artist_name: string
}

export type SongLyrics = {
    song_id: number
    song_title: string
    lyric_id: number
    lyrics_text: string
    language: string
    is_translated: boolean
}

export type ArtistSong = {
    song_id: number
    song_title: string
}

export type SongLyricsById = {
    song_title: string
    songLyrics: SongLyrics[]
}

export type ArtistSongs = {
    artist_name: string
    songs: ArtistSong[]
}

export type AddSongResult = {
    song_id: number
}

export type UpsertLyricsResult = {
    lyric_id: number
    created: boolean
}

export type SongUpdates = {
    song_title?: string
    artist_name?: string
}
