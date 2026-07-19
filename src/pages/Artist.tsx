import "../styles/Artist.css"
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"

interface ArtistSong {
    song_id: number
    song_title: string
}

function Artist() {
    const { id } = useParams()
    const [artistName, setArtistName] = useState("")
    const [songs, setSongs] = useState<ArtistSong[]>([])

    useEffect(() => {
        const fetchArtistData = async () => {
            try {
                const baseUrl = import.meta.env.VITE_SERVER_BASE_URL
                const songsUrl = import.meta.env.VITE_SONGS_URL
                const response = await fetch(`${baseUrl}${songsUrl}/artist/${id}`)
                const data = await response.json()
                setArtistName(data.artist_name)
                setSongs(data.songs)
            } catch (error) {
                console.error("Error fetching artist:", error)
            }
        }

        fetchArtistData()
    }, [id])

    return (
        <div className="artist-container">
            <h1>{artistName || "Artist"}</h1>
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
