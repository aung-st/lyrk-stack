import "../styles/Home.css"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

import SongFilter from "../components/SongFilter.tsx"
import { getSongs } from "../utils/songService.ts"

function Home() {
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

    const filterByTitlePrefix = (song: Song, query: string) =>
        song.song_title.toLowerCase().startsWith(query)

    return (
        <SongFilter
            songs={songs}
            id="search-bar"
            placeholder="Search for a song"
            noResultsMessage="No results found"
            filter={filterByTitlePrefix}
            showAllOnEmptyQuery={false}
            className="song-filter-home"
        >
            {(filteredSongs) =>
                filteredSongs.length > 0 && (
                    <ul className="song-list">
                        <li className="result-header">
                            <span>Song</span>
                            <span>Artist</span>
                        </li>
                        {filteredSongs.map((item) => (
                            <li className="results" key={item.song_id}>
                                <Link to={`/songs/${item.song_id}`}>
                                    {item.song_title}
                                </Link>
                                <Link to={`/artists/${item.artist_id}`}>
                                    {item.artist_name
                                        ? item.artist_name
                                        : "Unknown Artist"}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )
            }
        </SongFilter>
    )
}

export default Home
