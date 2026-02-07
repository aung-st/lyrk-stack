import "../styles/Songs.css"
import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

const serverBaseURL: string = import.meta.env.VITE_SERVER_BASE_URL!
const songsURL: string = import.meta.env.VITE_SONGS_URL!

function Songs() {
    const [songs, setSongs] = useState<Song[]>([])
    const [songsCollectionDataFetched, setSongsCollectionDataFetched] =
        useState(false)
    const songsCollectionURL = `${serverBaseURL}${songsURL}`
    const fetchSongCollectionData = async () => {
        const response = await axios.get<Songs>(songsCollectionURL)

        setSongs(response.data.songs)
    }

    if (!songsCollectionDataFetched) {
        setSongsCollectionDataFetched(true)
        fetchSongCollectionData()
    }

    return (
        <div className="songs-container">
            <h1>Songs</h1>
            <div className="songs-wrapper">
                <hr></hr>
                <div className="list-row">
                    <ul className="songs-list">
                        <h2>Name</h2>
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
                    <ul className="artists-list">
                        <h2>Artist</h2>

                        {songs.map((item: Song) => (
                            <li key={item.song_id}>
                                <Link
                                    to={`/artists/${item.artist_id}`}
                                    state={{ from: { item } }}
                                >
                                    {item.artist_name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Songs
