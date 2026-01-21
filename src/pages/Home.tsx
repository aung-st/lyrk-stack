import "../styles/Home.css"
import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

function Home() {
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

    const placeholder: string = "Search for a song"
    const [songs, setSongs] = useState<Song[]>([])
    const [searchValue, setSearchValue] = useState(placeholder)
    const [dataFetched, setDataFetched] = useState(false)

    const fetchData = async () => {
        const response = await axios.get<Songs>(
            "http://localhost:3000/api/data/songs",
        )
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
                <ul className="song-list">
                    {searchResults.length > 0 ? (
                        searchResults.map((item) => (
                            <li className="results" key={item.song_id}>
                                <Link
                                    to={`/songs/${item.song_id}`}
                                    state={{ from: { item } }}
                                >
                                    {item.song_title}
                                </Link>
                            </li>
                        ))
                    ) : searchValue !== placeholder && searchValue !== "" ? (
                        <li className="results">No results found</li>
                    ) : null}
                </ul>
            </div>
        </>
    )
}

export default Home
