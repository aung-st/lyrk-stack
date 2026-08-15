import "../styles/Artist.css"
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"

import { getSongsByArtist } from "../utils/songService.ts"

function Artist() {
    const { id } = useParams()
    const [artistName, setArtistName] = useState("")
    const [songs, setSongs] = useState<{ song_id: number; song_title: string }[]>([])

    useEffect(() => {
        const fetchArtistData = async () => {
            try {
                const data = await getSongsByArtist(Number(id))
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
