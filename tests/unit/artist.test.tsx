import { vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"

import Artist from "../../src/pages/Artist"

const mockArtistData = {
    artist_name: "Altai Kai",
    songs: [
        { song_id: 1, song_title: "Tengir Azun" },
        { song_id: 2, song_title: "Jerim" },
    ],
}

beforeEach(() => {
    globalThis.fetch = vi.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockArtistData),
        } as Response),
    )
})

afterEach(() => {
    vi.restoreAllMocks()
})

describe("Artist Page", () => {
    it("renders the artist name after fetching", async () => {
        render(
            <MemoryRouter initialEntries={["/artists/1"]}>
                <Routes>
                    <Route path="/artists/:id" element={<Artist />} />
                </Routes>
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(screen.getByText("Altai Kai")).toBeInTheDocument()
        })
    })

    it("renders the placeholder name before fetching", async () => {
        globalThis.fetch = vi.fn(() => new Promise<never>(() => {}))

        render(
            <MemoryRouter initialEntries={["/artists/1"]}>
                <Routes>
                    <Route path="/artists/:id" element={<Artist />} />
                </Routes>
            </MemoryRouter>,
        )

        expect(screen.getByText("Artist")).toBeInTheDocument()
    })

    it("renders the artist's songs as links", async () => {
        render(
            <MemoryRouter initialEntries={["/artists/1"]}>
                <Routes>
                    <Route path="/artists/:id" element={<Artist />} />
                </Routes>
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(screen.getByText("Tengir Azun")).toBeInTheDocument()
            expect(screen.getByText("Jerim")).toBeInTheDocument()
        })
    })

    it("renders an hr element", async () => {
        render(
            <MemoryRouter initialEntries={["/artists/1"]}>
                <Routes>
                    <Route path="/artists/:id" element={<Artist />} />
                </Routes>
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(screen.getByRole("separator")).toBeInTheDocument()
        })
    })

    it("fetches artist data on mount", async () => {
        render(
            <MemoryRouter initialEntries={["/artists/1"]}>
                <Routes>
                    <Route path="/artists/:id" element={<Artist />} />
                </Routes>
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledTimes(1)
        })
    })

    it("renders the error message when the artist is not found", async () => {
        globalThis.fetch = vi.fn(() =>
            Promise.resolve({
                ok: false,
                json: () =>
                    Promise.resolve({
                        error: "Artist not found",
                    }),
            } as Response),
        )

        render(
            <MemoryRouter initialEntries={["/artists/999"]}>
                <Routes>
                    <Route path="/artists/:id" element={<Artist />} />
                </Routes>
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(screen.getByText("Artist not found")).toBeInTheDocument()
        })
    })
})
