import { useState, useEffect, useCallback, useRef } from "react"

import {
    getSongs,
    getSongLyrics,
    updateSong,
    addSongLyrics,
    updateSongLyric,
    deleteSong,
    getExportUrl,
} from "../utils/songService.ts"
import type { SongEditPanelProps } from "../components/settings/types.ts"

interface UseSongManagerResult {
    songs: Song[]
    error: string
    editingSongId: number | null
    toggleSongEdit: (song: Song) => void
    handleDelete: (songId: number) => Promise<void>
    handleExport: () => void
    editPanel: SongEditPanelProps
}

export function useManageSongs(): UseSongManagerResult {
    const [songs, setSongs] = useState<Song[]>([])
    const [editingSongId, setEditingSongId] = useState<number | null>(null)
    const [editTitle, setEditTitle] = useState("")
    const [editArtist, setEditArtist] = useState("")
    const [lyrics, setLyrics] = useState<LyricsBySong[]>([])
    const [editingLyricId, setEditingLyricId] = useState<number | null>(null)
    const [lyricDraft, setLyricDraft] = useState("")
    const [lyricLanguage, setLyricLanguage] = useState("")
    const [lyricIsTranslated, setLyricIsTranslated] = useState(false)
    const [error, setError] = useState("")

    const lyricsFetchId = useRef(0)

    const fetchSongs = useCallback(async () => {
        try {
            setSongs(await getSongs())
        } catch (err) {
            console.error("Error fetching songs:", err)
        }
    }, [])

    useEffect(() => {
        fetchSongs()
    }, [fetchSongs])

    const fetchLyrics = useCallback(async (songId: number) => {
        const fetchId = ++lyricsFetchId.current
        try {
            const { songLyrics } = await getSongLyrics(songId)
            if (fetchId === lyricsFetchId.current) {
                setLyrics(songLyrics)
            }
        } catch (err) {
            console.error("Error fetching lyrics:", err)
            if (fetchId === lyricsFetchId.current) {
                setLyrics([])
            }
        }
    }, [])

    const openSongEdit = async (song: Song) => {
        const songId = song.song_id
        setEditingSongId(songId)
        setEditTitle(song.song_title)
        setEditArtist(song.artist_name ?? "")
        setEditingLyricId(null)
        setLyricDraft("")
        setLyricLanguage("")
        setLyricIsTranslated(false)
        setError("")
        await fetchLyrics(songId)
    }

    const closeSongEdit = () => {
        setEditingSongId(null)
        setEditingLyricId(null)
        setLyricDraft("")
        setLyricLanguage("")
        setLyricIsTranslated(false)
        setLyrics([])
        setError("")
    }

    const handleSaveSong = async () => {
        setError("")
        if (editingSongId === null) return

        try {
            await updateSong(editingSongId, {
                song_title: editTitle,
                artist_name: editArtist,
            })
            closeSongEdit()
            await fetchSongs()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong")
        }
    }

    const openLyricEdit = (lyric: LyricsBySong) => {
        setEditingLyricId(lyric.lyric_id)
        setLyricDraft(lyric.lyrics_text)
        setLyricIsTranslated(lyric.is_translated)
    }

    const handleSaveLyric = async () => {
        setError("")
        if (editingSongId === null) return

        try {
            if (editingLyricId === null) {
                await addSongLyrics({
                    song_id: editingSongId,
                    language: lyricLanguage,
                    lyrics_text: lyricDraft,
                    is_translated: lyricIsTranslated,
                })
                await fetchLyrics(editingSongId)
                return
            }

            await updateSongLyric(editingLyricId, {
                lyrics_text: lyricDraft,
                is_translated: lyricIsTranslated,
            })
            setLyrics((prev) =>
                prev.map((lyric) =>
                    lyric.lyric_id === editingLyricId
                        ? {
                              ...lyric,
                              lyrics_text: lyricDraft,
                              is_translated: lyricIsTranslated,
                          }
                        : lyric,
                ),
            )
            setEditingLyricId(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong")
        }
    }

    const toggleSongEdit = (song: Song) => {
        if (editingSongId === song.song_id) {
            closeSongEdit()
        } else {
            openSongEdit(song)
        }
    }

    const handleDelete = async (songId: number) => {
        if (!window.confirm("Delete this song and all its lyrics?")) return

        try {
            await deleteSong(songId)
            if (editingSongId === songId) {
                closeSongEdit()
            }
            await fetchSongs()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong")
        }
    }

    const handleExport = () => {
        window.open(getExportUrl(), "_blank")
    }

    const editPanel: SongEditPanelProps = {
        form: {
            title: editTitle,
            artist: editArtist,
            onTitleChange: setEditTitle,
            onArtistChange: setEditArtist,
            onSubmit: handleSaveSong,
        },
        lyricsEditor: {
            lyrics,
            editingLyricId,
            draft: lyricDraft,
            language: lyricLanguage,
            isTranslated: lyricIsTranslated,
            onEdit: openLyricEdit,
            onDraftChange: setLyricDraft,
            onLanguageChange: setLyricLanguage,
            onIsTranslatedChange: setLyricIsTranslated,
            onSubmit: handleSaveLyric,
            onCancel: () => setEditingLyricId(null),
        },
    }

    return {
        songs,
        error,
        editingSongId,
        toggleSongEdit,
        handleDelete,
        handleExport,
        editPanel,
    }
}
