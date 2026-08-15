import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

import "../styles/Song.css"
import { getSongLyrics, deleteSong } from "../utils/songService.ts"

function Song() {
    const { id } = useParams()
    const navigate = useNavigate()
    const songId = Number(id)

    const [lyrics, setLyrics] = useState<LyricsBySong[]>([])
    const [songTitle, setSongTitle] = useState("")
    const [selectedIndexLeft, setSelectedIndexLeft] = useState<number>(0)
    const [selectedIndexRight, setSelectedIndexRight] = useState<number>(0)

    useEffect(() => {
        const fetchSongLyricsData = async () => {
            try {
                const { songLyrics, song_title } = await getSongLyrics(songId)
                setLyrics(songLyrics ?? [])
                setSongTitle(song_title ?? "")
            } catch (error) {
                console.error("Error fetching lyrics:", error)
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
        } catch (error) {
            console.error("Error deleting song:", error)
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
