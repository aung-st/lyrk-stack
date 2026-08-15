import "../styles/Songs.css"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

import { getSongs } from "../utils/songService.ts"

function Songs() {
    const [songs, setSongs] = useState<Song[]>([])

    useEffect(() => {
        const fetchSongCollectionData = async () => {
            try {
                setSongs(await getSongs())
            } catch (error) {
                console.error("Error fetching songs:", error)
            }
        }

        fetchSongCollectionData()
    }, [])

    return (
        <div className="songs-container">
            <h1>Songs</h1>
            <div className="songs-wrapper">
                <hr />
                <div className="list-row">
                    <ul className="songs-list">
                        <h2>Name</h2>
                        {songs.map((item: Song) => (
                            <li key={item.song_id}>
                                <Link to={`/songs/${item.song_id}`}>
                                    {item.song_title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <ul className="artists-list">
                        <h2>Artist</h2>
                        {songs.map((item: Song) => (
                            <li key={item.song_id}>
                                <Link to={`/artists/${item.artist_id}`}>
                                    {item.artist_name
                                        ? item.artist_name
                                        : "Unknown Artist"}
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
