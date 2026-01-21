import { useLocation } from "react-router-dom"
import { useState } from "react"
import axios from "axios"
import "../styles/Song.css"

function Song() {
    type Song = {
        song_id: number
        song_title: string
        lyric_id: number
        lyrics_text: string
        language: string
        is_translated: boolean
    }

    type Songs = {
        songLyrics: Song[]
    }

    const location = useLocation()
    const { from } = location.state
    const songId = from.item.song_id
    const [songs, setSongs] = useState<Song[]>([])
    const [dataFetched, setDataFetched] = useState(false)
    const [selectedIndexLeft, setSelectedIndexLeft] = useState(0)
    const [selectedIndexRight, setSelectedIndexRight] = useState(0)

    const fetchData = async () => {
        const response = await axios.get<Songs>(
            `http://localhost:3000/api/data/songLyrics/${songId}`,
        )
        setSongs(response.data.songLyrics)
    }

    if (!dataFetched) {
        setDataFetched(true)
        fetchData()
    }

    // Handle by left and right component to avoid changing state of both at the same time
    const handleButtonClickLeft = (index: number) => {
        const newIndex: number = index
        setSelectedIndexLeft(newIndex)
    }

    const handleButtonClickRight = (index: number) => {
        const newIndex: number = index
        setSelectedIndexRight(newIndex)
    }

    // Create a button for every language available
    const buttonListLeft = songs.map((item: Song, index: number) => (
        <li key={index}>
            <button onClick={() => handleButtonClickLeft(index)}>
                {item.language}
            </button>
        </li>
    ))

    const buttonListRight = songs.map((item: Song, index: number) => (
        <li key={index}>
            <button onClick={() => handleButtonClickRight(index)}>
                {item.language}
            </button>
        </li>
    ))

    return (
        <>
            <div className="song-header">
                <h1>{songs[0]?.song_title}</h1>
            </div>
            <div className="song-wrapper">
                <div className="lyric left">
                    <ul className="button-list">{buttonListLeft}</ul>
                    {/* Display the selected translation */}
                    <h4>{songs[selectedIndexLeft]?.lyrics_text}</h4>
                </div>
                <div className="lyric right">
                    <ul className="button-list">{buttonListRight}</ul>
                    {/* Display the selected translation */}
                    <h4>{songs[selectedIndexRight]?.lyrics_text}</h4>
                </div>
            </div>
        </>
    )
}

export default Song
