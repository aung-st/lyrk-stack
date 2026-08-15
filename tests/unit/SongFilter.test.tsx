import { render, screen, fireEvent } from "@testing-library/react"

import SongFilter from "../../src/components/SongFilter"

const mockSongs = [
    { song_id: 1, song_title: "Tengir Azun", artist_id: 1, artist_name: "Dimash" },
    { song_id: 2, song_title: "SOS", artist_id: 1, artist_name: "Dimash" },
]

function renderFilter() {
    return render(
        <SongFilter
            songs={mockSongs}
            label="Filter songs"
            id="settings-filter"
            placeholder="Search by title or artist"
            noResultsMessage="No songs match your search."
        >
            {(filteredSongs) => (
                <ul>
                    {filteredSongs.map((song) => (
                        <li key={song.song_id}>{song.song_title}</li>
                    ))}
                </ul>
            )}
        </SongFilter>,
    )
}

describe("SongFilter", () => {
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

    it("shows a message when no songs match the filter", () => {
        renderFilter()

        fireEvent.change(screen.getByLabelText(/Filter songs/i), {
            target: { value: "Nonexistent Song" },
        })

        expect(screen.getByText("No songs match your search.")).toBeInTheDocument()
        expect(screen.queryByText("Tengir Azun")).not.toBeInTheDocument()
    })
})
