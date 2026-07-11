import "../styles/Home.css"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

function Home() {
    const placeholder: string = "Search for a song"
    const [songs, setSongs] = useState<Song[]>([])
    const [searchValue, setSearchValue] = useState(placeholder)

    useEffect(() => {
        const fetchSongCollectionData = async () => {
            try {
                const baseUrl = import.meta.env.VITE_SERVER_BASE_URL
                const songsUrl = import.meta.env.VITE_SONGS_URL
                const response = await fetch(`${baseUrl}${songsUrl}`)
                const data = await response.json()
                setSongs(data.songs)
            } catch (error) {
                console.error("Error fetching songs:", error)
            }
        }

        fetchSongCollectionData()
    }, [])

    const searchResults = songs.filter((item) => {
        if (searchValue === "" || searchValue === placeholder) {
            return false
        }

        const title: string = item.song_title.toLowerCase()
        return title.startsWith(searchValue.toLowerCase())
    })

    return (
        <>
            <div className="search-container">
                <input
                    onChange={(e) => setSearchValue(e.target.value)}
                    id="search-bar"
                    type="text"
                    name="search"
                    placeholder={searchValue}
                />
            </div>
            <div className="search-container">
                {searchResults.length > 0 ? (
                    <ul className="song-list">
                        <li className="result-header">
                            <span>Song</span>
                            <span>Artist</span>
                        </li>
                        {searchResults.map((item) => (
                            <li className="results" key={item.song_id}>
                                <Link
                                    to={`/songs/${item.song_id}`}
                                    state={{ from: { item } }}
                                >
                                    {item.song_title}
                                </Link>
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
                ) : (
                    searchValue !== placeholder &&
                    searchValue !== "" && (
                        <div className="no-results">No results found</div>
                    )
                )}
            </div>
        </>
    )
}

export default Home
