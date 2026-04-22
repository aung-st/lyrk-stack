import "../styles/Songs.css"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

function Songs() {
    const [songs, setSongs] = useState<Song[]>([])
    const [songsCollectionDataFetched, setSongsCollectionDataFetched] =
        useState(false)

    useEffect(() => {
        const fetchSongCollectionData = async () => {
            try {
                const response = await fetch("../../songs.json")
                const data = await response.json()
                setSongs(data)
            } catch (error) {
                console.error("Error fetching songs:", error)
            }
        }

        if (!songsCollectionDataFetched) {
            setSongsCollectionDataFetched(true)
            fetchSongCollectionData()
        }
    }, [songsCollectionDataFetched])

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
