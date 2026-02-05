declare global {
    type Song = {
        song_id: number
        song_title: string
        artist_id: number
        artist_name: string
    }

    type Songs = {
        songs: Song[]
    }

    type LyricsBySong = {
        song_id: number
        song_title: string
        lyric_id: number
        lyrics_text: string
        language: string
        is_translated: boolean
    }

    type LyricsBySongResponse = {
        songLyrics: LyricsBySong[]
    }
}

export {}
