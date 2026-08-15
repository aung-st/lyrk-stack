import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

import "../styles/Song.css"
import ErrorDisplay from "../components/ErrorDisplay.tsx"
import { getSongLyrics, deleteSong } from "../utils/songService.ts"

function Song() {
    const { id } = useParams()
    const navigate = useNavigate()
    const songId = Number(id)

    const [lyrics, setLyrics] = useState<LyricsBySong[]>([])
    const [songTitle, setSongTitle] = useState("")
    const [error, setError] = useState<Error | string | null>(null)
    const [selectedIndexLeft, setSelectedIndexLeft] = useState<number>(0)
    const [selectedIndexRight, setSelectedIndexRight] = useState<number>(0)

    useEffect(() => {
        const fetchSongLyricsData = async () => {
            try {
                const { songLyrics, song_title } = await getSongLyrics(songId)
                setLyrics(songLyrics ?? [])
                setSongTitle(song_title ?? "")
                setError(null)
            } catch (err) {
                setError(
                    err instanceof Error ? err : new Error("Something went wrong"),
                )
            }
        }

        fetchSongLyricsData()
    }, [songId])

    // Handle button click for left and right components
    const handleButtonClickLeft = (index: number) => {
        setSelectedIndexLeft(index)
    }

    const handleButtonClickRight = (index: number) => {
        setSelectedIndexRight(index)
    }

    const handleDelete = async () => {
        if (!window.confirm("Delete this song and all its lyrics?")) return

        try {
            await deleteSong(songId)
            navigate("/songs")
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Something went wrong"))
        }
    }

    // Create a button for every language available
    const buttonListLeft = lyrics.map((item, index) => (
        <li key={index}>
            <button onClick={() => handleButtonClickLeft(index)}>
                {item.language}
            </button>
        </li>
    ))

    const buttonListRight = lyrics.map((item, index) => (
        <li key={index}>
            <button onClick={() => handleButtonClickRight(index)}>
                {item.language}
            </button>
        </li>
    ))

    return (
        <>
            {error && <ErrorDisplay error={error} />}
            <div className="song-header">
                <h1>{songTitle || "Song Title"}</h1>
                <button className="delete-button" onClick={handleDelete}>
                    Delete
                </button>
            </div>
            <div className="button-wrapper">
                <ul className="button-list left">{buttonListLeft}</ul>
                <ul className="button-list right">{buttonListRight}</ul>
            </div>
            {!error && lyrics.length === 0 && (
                <p className="empty-state">No lyrics yet</p>
            )}
            <div className="song-wrapper">
                <div className="lyric left">
                    {lyrics[selectedIndexLeft]?.lyrics_text
                        ?.split("\n")
                        .map((line, index) => (
                            <span key={index}>
                                {line}
                                <br />
                            </span>
                        ))}
                </div>
                <div className="lyric right">
                    {lyrics[selectedIndexRight]?.lyrics_text
                        ?.split("\n")
                        .map((line, index) => (
                            <span key={index}>
                                {line}
                                <br />
                            </span>
                        ))}
                </div>
            </div>
        </>
    )
}

export default Song
