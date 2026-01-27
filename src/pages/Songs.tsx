import "../styles/Songs.css"
import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

const serverBaseURL: string = import.meta.env.VITE_SERVER_BASE_URL!
const songsURL: string = import.meta.env.VITE_SONGS_URL!

function Songs() {
    type Song = {
        song_id: number
        song_title: string
        lyric_id: number
        lyrics_text: string
        language: string
        is_translated: boolean
    }

    type Songs = {
        songs: Song[]
    }
    const [songs, setSongs] = useState<Song[]>([])
    const [dataFetched, setDataFetched] = useState(false)

    const fetchData = async () => {
        const response = await axios.get<Songs>(`${serverBaseURL}${songsURL}`)

        setSongs(response.data.songs)
    }

    if (!dataFetched) {
        setDataFetched(true)
        fetchData()
    }

    return (
        <>
            <h1 id="song-header">Songs</h1>
            <ul className="song-list">
                {songs.map((item: Song) => (
                    <li key={item.song_id}>
                        <Link
                            to={`/songs/${item.song_id}`}
                            state={{ from: { item } }}
                        >
                            {item.song_title}
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default Songs
