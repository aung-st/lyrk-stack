import { useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import "../styles/Song.css"

function Song() {
    const location = useLocation()
    const { from } = location.state
    const songId = from.item.song_id

    const [lyrics, setLyrics] = useState<LyricsBySong[]>([])
    const [selectedIndexLeft, setSelectedIndexLeft] = useState<number>(0)
    const [selectedIndexRight, setSelectedIndexRight] = useState<number>(0)

    useEffect(() => {
        const fetchSongLyricsData = async () => {
            try {
                const response = await fetch("../../lyrics.json")
                const data: LyricsBySong[] = await response.json()

                // Filter lyrics by song_id
                const filteredLyrics = data.filter(
                    (lyric) => lyric.song_id === songId,
                )
                setLyrics(filteredLyrics)
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
                <h1>{lyrics[0]?.song_title || "Song Title"}</h1>
            </div>
            <div className="button-wrapper">
                <ul className="button-list left">{buttonListLeft}</ul>
                <ul className="button-list right">{buttonListRight}</ul>
            </div>
            <div className="song-wrapper">
                <div className="lyric left">
                    {lyrics[selectedIndexLeft]?.lyrics_text
                        .split("\n")
                        .map((line, index) => (
                            <span key={index}>
                                {line}
                                <br />
                            </span>
                        ))}
                </div>
                <div className="lyric right">
                    {lyrics[selectedIndexRight]?.lyrics_text
                        .split("\n")
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
