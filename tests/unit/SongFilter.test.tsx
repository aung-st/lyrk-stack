import { vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import type { ComponentProps } from "react"

import SongFilter from "../../src/components/SongFilter"

const mockSongs = [
    { song_id: 1, song_title: "Tengir Azun", artist_id: 1, artist_name: "Dimash" },
    { song_id: 2, song_title: "SOS", artist_id: 1, artist_name: "Dimash" },
]

type SongFilterProps = ComponentProps<typeof SongFilter>

function renderFilter(overrides: Partial<SongFilterProps> = {}) {
    return render(
        <SongFilter
            songs={mockSongs}
            label="Filter songs"
            id="settings-filter"
            placeholder="Search by title or artist"
            noResultsMessage="No songs match your search."
            {...overrides}
        >
            {(filteredSongs) =>
                filteredSongs.length > 0 && (
                    <ul>
                        {filteredSongs.map((song) => (
                            <li key={song.song_id}>{song.song_title}</li>
                        ))}
                    </ul>
                )
            }
        </SongFilter>,
    )
}

describe("SongFilter", () => {
    it("shows all songs on an empty query by default", () => {
        renderFilter()

        expect(screen.getByText("Tengir Azun")).toBeInTheDocument()
        expect(screen.getByText("SOS")).toBeInTheDocument()
    })

    it("renders no list on an empty query when showAllOnEmptyQuery is false", () => {
        renderFilter({ showAllOnEmptyQuery: false })

        expect(screen.queryByRole("list")).not.toBeInTheDocument()
    })

    it("filters the song list by title", () => {
        renderFilter()

        fireEvent.change(screen.getByLabelText(/Filter songs/i), {
            target: { value: "SOS" },
        })

        expect(screen.getByText("SOS")).toBeInTheDocument()
        expect(screen.queryByText("Tengir Azun")).not.toBeInTheDocument()
    })

    it("filters the song list case-insensitively", () => {
        renderFilter()

        fireEvent.change(screen.getByLabelText(/Filter songs/i), {
            target: { value: "sos" },
        })

        expect(screen.getByText("SOS")).toBeInTheDocument()
        expect(screen.queryByText("Tengir Azun")).not.toBeInTheDocument()
    })

    it("filters the song list by artist", () => {
        renderFilter()

        fireEvent.change(screen.getByLabelText(/Filter songs/i), {
            target: { value: "Dimash" },
        })

        expect(screen.getByText("Tengir Azun")).toBeInTheDocument()
        expect(screen.getByText("SOS")).toBeInTheDocument()
    })

    it("respects a custom filter predicate", () => {
        renderFilter({
            filter: (song, query) => song.song_title.toLowerCase().startsWith(query),
        })

        fireEvent.change(screen.getByLabelText(/Filter songs/i), {
            target: { value: "teng" },
        })

        expect(screen.getByText("Tengir Azun")).toBeInTheDocument()
        expect(screen.queryByText("SOS")).not.toBeInTheDocument()
    })

    it("omits the label when none is provided", () => {
        renderFilter({ label: undefined })

        expect(screen.queryByLabelText("Filter songs")).not.toBeInTheDocument()
        expect(screen.getByRole("textbox")).toBeInTheDocument()
    })

    it("shows a message when no songs match the filter", () => {
        renderFilter()

        fireEvent.change(screen.getByLabelText(/Filter songs/i), {
            target: { value: "Nonexistent Song" },
        })

        expect(screen.getByText("No songs match your search.")).toBeInTheDocument()
        expect(screen.queryByText("Tengir Azun")).not.toBeInTheDocument()
    })

    it("calls onQueryChange with each query update", () => {
        const onQueryChange = vi.fn()
        renderFilter({ onQueryChange })

        fireEvent.change(screen.getByLabelText(/Filter songs/i), {
            target: { value: "sos" },
        })

        expect(onQueryChange).toHaveBeenCalledWith("sos")
    })
})
