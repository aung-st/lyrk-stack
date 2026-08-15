import "../styles/Artist.css"
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"

import ErrorDisplay from "../components/ErrorDisplay.tsx"
import { getSongsByArtist } from "../utils/songService.ts"

function Artist() {
    const { id } = useParams()
    const [artistName, setArtistName] = useState("")
    const [songs, setSongs] = useState<{ song_id: number; song_title: string }[]>([])
    const [error, setError] = useState<Error | string | null>(null)

    useEffect(() => {
        const fetchArtistData = async () => {
            try {
                const data = await getSongsByArtist(Number(id))
                setArtistName(data.artist_name)
                setSongs(data.songs)
                setError(null)
            } catch (err) {
                setError(
                    err instanceof Error ? err : new Error("Something went wrong"),
                )
            }
        }

        fetchArtistData()
    }, [id])

    return (
        <div className="artist-container">
            <h1>{artistName || "Artist"}</h1>
            {error && <ErrorDisplay error={error} />}
            {!error && songs.length === 0 && (
                <p className="empty-state">No songs by this artist yet</p>
            )}
            <hr />
            <ul className="artist-songs-list">
                {songs.map((song) => (
                    <li key={song.song_id}>
                        <Link to={`/songs/${song.song_id}`}>{song.song_title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Artist
