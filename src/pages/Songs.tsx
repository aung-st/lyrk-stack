import "../styles/Songs.css"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

import ErrorDisplay from "../components/ErrorDisplay.tsx"
import { getSongs } from "../utils/songService.ts"

function Songs() {
    const [songs, setSongs] = useState<Song[]>([])
    const [error, setError] = useState<Error | string | null>(null)

    useEffect(() => {
        const fetchSongCollectionData = async () => {
            try {
                setSongs(await getSongs())
                setError(null)
            } catch (err) {
                setError(
                    err instanceof Error ? err : new Error("Something went wrong"),
                )
            }
        }

        fetchSongCollectionData()
    }, [])

    return (
        <div className="songs-container">
            <h1>Songs</h1>
            {error && <ErrorDisplay error={error} />}
            {!error && songs.length === 0 && (
                <p className="empty-state">No songs yet</p>
            )}
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
