import "../styles/Home.css"
import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

const serverBaseURL: string = import.meta.env.VITE_SERVER_BASE_URL!
const songsURL: string = import.meta.env.VITE_SONGS_URL!

function Home() {
    type Song = {
        song_id: number
        song_title: string
        artist_id: number
        artist_name: string
    }

    type Songs = {
        songs: Song[]
    }

    const placeholder: string = "Search for a song"
    const [songs, setSongs] = useState<Song[]>([])
    const [searchValue, setSearchValue] = useState(placeholder)
    const [dataFetched, setDataFetched] = useState(false)

    const fetchData = async () => {
        const response = await axios.get<Songs>(`${serverBaseURL}${songsURL}`)
        setSongs(response.data.songs)
    }

    if (!dataFetched) {
        setDataFetched(true)
        fetchData()
    }

    const searchResults = songs.filter((item) => {
        if (searchValue === "" || searchValue === placeholder) {
            return false
        }

        const title: string = item.song_title.toLowerCase()
        if (title.startsWith(searchValue.toLowerCase())) {
            return title
        }
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
                ></input>
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
                                    {item.artist_name}
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
