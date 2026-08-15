import "../styles/Home.css"
import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"

import SongFilter from "../components/SongFilter.tsx"
import ErrorDisplay from "../components/ErrorDisplay.tsx"
import { getSongs } from "../utils/songService.ts"

function Home() {
    const [songs, setSongs] = useState<Song[]>([])
    const [error, setError] = useState("")
    const [query, setQuery] = useState("")

    const fetchSongs = useCallback(async (showError: boolean) => {
        try {
            setSongs(await getSongs())
            setError("")
        } catch (error) {
            if (showError) {
                setError(
                    error instanceof Error ? error.message : "Something went wrong",
                )
            }
        }
    }, [])

    useEffect(() => {
        fetchSongs(false)
    }, [fetchSongs])

    useEffect(() => {
        if (query === "") return

        const timeout = setTimeout(() => {
            fetchSongs(true)
        }, 300)

        return () => clearTimeout(timeout)
    }, [query, fetchSongs])

    const filterByTitlePrefix = (song: Song, query: string) =>
        song.song_title.toLowerCase().startsWith(query)

    return (
        <>
            {error && <ErrorDisplay message={error} />}
            <SongFilter
                songs={songs}
                id="search-bar"
                placeholder="Search for a song"
                noResultsMessage="No results found"
                filter={filterByTitlePrefix}
                showAllOnEmptyQuery={false}
                className="song-filter-home"
                onQueryChange={setQuery}
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
        </>
    )
}

export default Home
