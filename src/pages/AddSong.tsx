import "../styles/AddSong.css"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { getSongs, addSong, addSongLyrics } from "../utils/songService.ts"
import ErrorDisplay from "../components/ErrorDisplay.tsx"

function AddSong() {
    const navigate = useNavigate()
    const [songTitle, setSongTitle] = useState("")
    const [artistName, setArtistName] = useState("")
    const [language, setLanguage] = useState("")
    const [lyricsText, setLyricsText] = useState("")
    const [isTranslated, setIsTranslated] = useState(false)
    const [songs, setSongs] = useState<Song[]>([])
    const [selectedSongId, setSelectedSongId] = useState<number | null>(null)
    const [mode, setMode] = useState<"new" | "existing">("new")
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                setSongs(await getSongs())
            } catch (err) {
                console.error("Error fetching songs:", err)
            }
        }

        fetchSongs()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        try {
            let songId = selectedSongId

            if (mode === "new") {
                const songData = await addSong({
                    song_title: songTitle,
                    artist_name: artistName,
                })
                songId = songData.song_id
            }

            if (!songId) {
                throw new Error("No song selected")
            }

            await addSongLyrics({
                song_id: songId,
                language,
                lyrics_text: lyricsText,
                is_translated: isTranslated,
            })

            navigate(`/songs/${songId}`)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong")
        }
    }

    return (
        <div className="add-song-container">
            <h1>Add Song</h1>
            {error && <ErrorDisplay error={error} />}
            <div className="mode-toggle">
                <button
                    className={mode === "new" ? "active" : ""}
                    onClick={() => setMode("new")}
                    type="button"
                >
                    New Song
                </button>
                <button
                    className={mode === "existing" ? "active" : ""}
                    onClick={() => setMode("existing")}
                    type="button"
                >
                    Add Translation
                </button>
            </div>
            <form onSubmit={handleSubmit}>
                {mode === "new" ? (
                    <>
                        <div className="form-group">
                            <label htmlFor="song-title">Song Title</label>
                            <input
                                id="song-title"
                                type="text"
                                value={songTitle}
                                onChange={(e) => setSongTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="artist-name">Artist</label>
                            <input
                                id="artist-name"
                                type="text"
                                value={artistName}
                                onChange={(e) => setArtistName(e.target.value)}
                                required
                            />
                        </div>
                    </>
                ) : (
                    <div className="form-group">
                        <label htmlFor="existing-song">Select Song</label>
                        <select
                            id="existing-song"
                            value={selectedSongId ?? ""}
                            onChange={(e) =>
                                setSelectedSongId(Number(e.target.value))
                            }
                            required
                        >
                            <option value="" disabled>
                                Choose a song
                            </option>
                            {songs.map((song) => (
                                <option key={song.song_id} value={song.song_id}>
                                    {song.song_title} - {song.artist_name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <div className="form-group">
                    <label htmlFor="language">Language</label>
                    <input
                        id="language"
                        type="text"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group textbox">
                    <label htmlFor="lyrics-text">Lyrics</label>
                    <textarea
                        id="lyrics-text"
                        value={lyricsText}
                        onChange={(e) => setLyricsText(e.target.value)}
                        rows={15}
                        required
                    />
                </div>
                <div className="form-group checkbox">
                    <label htmlFor="is-translated">
                        <input
                            id="is-translated"
                            type="checkbox"
                            checked={isTranslated}
                            onChange={(e) => setIsTranslated(e.target.checked)}
                        />
                        This is a translation
                    </label>
                </div>
                <button type="submit">Add</button>
            </form>
        </div>
    )
}

export default AddSong
