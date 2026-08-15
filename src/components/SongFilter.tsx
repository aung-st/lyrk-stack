import { useState } from "react"
import type { ReactNode } from "react"

export type SongFilterPredicate = (song: Song, query: string) => boolean

interface SongFilterProps {
    songs: Song[]
    label?: string
    id: string
    placeholder?: string
    noResultsMessage: string
    filter?: SongFilterPredicate
    showAllOnEmptyQuery?: boolean
    className?: string
    onQueryChange?: (query: string) => void
    children: (filteredSongs: Song[]) => ReactNode
}

function matchesTitleOrArtist(song: Song, query: string): boolean {
    return (
        song.song_title.toLowerCase().includes(query) ||
        (song.artist_name ?? "").toLowerCase().includes(query)
    )
}

function SongFilter({
    songs,
    label,
    id,
    placeholder,
    noResultsMessage,
    filter = matchesTitleOrArtist,
    showAllOnEmptyQuery = true,
    className,
    onQueryChange,
    children,
}: SongFilterProps) {
    const [query, setQuery] = useState("")

    const normalizedQuery = query.trim().toLowerCase()
    const hasQuery = normalizedQuery !== ""
    const filteredSongs =
        !showAllOnEmptyQuery && !hasQuery
            ? []
            : songs.filter((song) => filter(song, normalizedQuery))
    const showNoResults = hasQuery && filteredSongs.length === 0

    return (
        <div className={className ? `song-filter ${className}` : "song-filter"}>
            <div className="form-group">
                {label && <label htmlFor={id}>{label}</label>}
                <input
                    id={id}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        onQueryChange?.(e.target.value)
                    }}
                    placeholder={placeholder}
                />
            </div>
            {children(filteredSongs)}
            {showNoResults && <p className="no-results">{noResultsMessage}</p>}
        </div>
    )
}

export default SongFilter
