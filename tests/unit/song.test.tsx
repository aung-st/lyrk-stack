import { vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"

import Song from "../../src/pages/Song"

const mockLyrics = [
    {
        song_id: 1,
        song_title: "Tengir Azun",
        lyric_id: 1,
        lyrics_text: "Line one\nLine two",
        language: "Kazakh",
        is_translated: false,
    },
    {
        song_id: 1,
        song_title: "Tengir Azun",
        lyric_id: 2,
        lyrics_text: "Translated line one\nTranslated line two",
        language: "English",
        is_translated: true,
    },
]

beforeEach(() => {
    vi.fn().mockResolvedValue(undefined)
    globalThis.fetch = vi.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({ songLyrics: mockLyrics }),
        } as Response),
    )
})

afterEach(() => {
    vi.restoreAllMocks()
})

describe("Song Page", () => {
    it("renders the song title from fetched lyrics", async () => {
        render(
            <MemoryRouter initialEntries={["/songs/1"]}>
                <Routes>
                    <Route path="/songs/:id" element={<Song />} />
                </Routes>
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(screen.getByText("Tengir Azun")).toBeInTheDocument()
        })
    })

    it("renders the placeholder title when no lyrics are fetched yet", async () => {
        globalThis.fetch = vi.fn(() => new Promise<never>(() => {}))

        render(
            <MemoryRouter initialEntries={["/songs/1"]}>
                <Routes>
                    <Route path="/songs/:id" element={<Song />} />
                </Routes>
            </MemoryRouter>,
        )

        expect(screen.getByText("Song Title")).toBeInTheDocument()
    })

    it("renders language buttons for each lyrics entry", async () => {
        render(
            <MemoryRouter initialEntries={["/songs/1"]}>
                <Routes>
                    <Route path="/songs/:id" element={<Song />} />
                </Routes>
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(
                screen.getAllByRole("button", { name: /Kazakh/i }).length,
            ).toBeGreaterThan(0)
            expect(
                screen.getAllByRole("button", { name: /English/i }).length,
            ).toBeGreaterThan(0)
        })
    })

    it("renders the delete button", async () => {
        render(
            <MemoryRouter initialEntries={["/songs/1"]}>
                <Routes>
                    <Route path="/songs/:id" element={<Song />} />
                </Routes>
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalled()
        })

        expect(screen.getByRole("button", { name: /Delete/i })).toBeInTheDocument()
    })

    it("renders lyrics text after fetching", async () => {
        render(
            <MemoryRouter initialEntries={["/songs/1"]}>
                <Routes>
                    <Route path="/songs/:id" element={<Song />} />
                </Routes>
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(screen.getAllByText("Line one").length).toBeGreaterThan(0)
            expect(screen.getAllByText("Line two").length).toBeGreaterThan(0)
        })
    })

    it("fetches lyrics on mount", async () => {
        render(
            <MemoryRouter initialEntries={["/songs/1"]}>
                <Routes>
                    <Route path="/songs/:id" element={<Song />} />
                </Routes>
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledTimes(1)
        })
    })
})
