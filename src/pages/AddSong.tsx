import "../styles/AddSong.css"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

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
                const baseUrl = import.meta.env.VITE_SERVER_BASE_URL
                const songsUrl = import.meta.env.VITE_SONGS_URL
                const response = await fetch(`${baseUrl}${songsUrl}`)
                const data = await response.json()
                setSongs(data.songs)
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
            const baseUrl = import.meta.env.VITE_SERVER_BASE_URL
            const songsUrl = import.meta.env.VITE_SONGS_URL
            const lyricsUrl = import.meta.env.VITE_SONG_LYRICS_URL

            let songId = selectedSongId

            if (mode === "new") {
                const songResponse = await fetch(`${baseUrl}${songsUrl}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        song_title: songTitle,
                        artist_name: artistName,
                    }),
                })

                if (!songResponse.ok) {
                    throw new Error("Failed to add song")
                }

                const songData = await songResponse.json()
                songId = songData.song_id
            }

            if (!songId) {
                throw new Error("No song selected")
            }

            const lyricsResponse = await fetch(`${baseUrl}${lyricsUrl}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    song_id: songId,
                    language,
                    lyrics_text: lyricsText,
                    is_translated: isTranslated,
                }),
            })

            if (!lyricsResponse.ok) {
                throw new Error("Failed to add lyrics")
            }

            navigate(`/songs/${songId}`)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong")
        }
    }

    return (
        <div className="add-song-container">
            <h1>Add Song</h1>
            {error && <div className="error-message">{error}</div>}
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
