import { vi } from "vitest"
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"

import Settings from "../../src/pages/Settings"

const mockSongs = [
    { song_id: 1, song_title: "Tengir Azun", artist_id: 1, artist_name: "Dimash" },
    { song_id: 2, song_title: "SOS", artist_id: 1, artist_name: "Dimash" },
]

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

const mockFetch = vi.fn((url: string) => {
    if (url.includes("/songLyrics/")) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ songLyrics: mockLyrics }),
        } as Response)
    }
    return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ songs: mockSongs }),
    } as Response)
})

beforeEach(() => {
    globalThis.fetch = mockFetch as unknown as typeof fetch
})

afterEach(() => {
    vi.restoreAllMocks()
})

describe("Settings Page", () => {
    it("renders the settings heading and action buttons", async () => {
        render(
            <MemoryRouter>
                <Settings />
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalled()
        })

        expect(
            screen.getByRole("heading", { name: /Settings/i }),
        ).toBeInTheDocument()
        expect(screen.getByRole("button", { name: /Add Song/i })).toBeInTheDocument()
        expect(
            screen.getByRole("button", { name: /Export Data/i }),
        ).toBeInTheDocument()
    })

    it("lists songs fetched from the API", async () => {
        render(
            <MemoryRouter>
                <Settings />
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(screen.getByText("Tengir Azun")).toBeInTheDocument()
        })
        expect(screen.getByText("SOS")).toBeInTheDocument()
    })

    it("opens the song edit form and fetches lyrics when Edit is clicked", async () => {
        render(
            <MemoryRouter>
                <Settings />
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(screen.getByText("Tengir Azun")).toBeInTheDocument()
        })

        fireEvent.click(screen.getAllByRole("button", { name: /Edit/i })[0])

        expect(await screen.findByLabelText(/Song Title/i)).toBeInTheDocument()
        await waitFor(() => {
            expect(screen.getByText("Kazakh")).toBeInTheDocument()
        })
        expect(screen.getByText("English")).toBeInTheDocument()
    })

    it("toggles the song edit form off when Edit is clicked again", async () => {
        render(
            <MemoryRouter>
                <Settings />
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(screen.getByText("Tengir Azun")).toBeInTheDocument()
        })

        fireEvent.click(screen.getAllByRole("button", { name: /Edit/i })[0])
        expect(await screen.findByLabelText(/Song Title/i)).toBeInTheDocument()

        fireEvent.click(screen.getAllByRole("button", { name: /Edit/i })[0])
        await waitFor(() => {
            expect(screen.queryByLabelText(/Song Title/i)).not.toBeInTheDocument()
        })
    })

    it("shows an add-lyrics form without a cancel when the song has no lyrics", async () => {
        const localFetch = vi.fn((url: string) => {
            if (url.includes("/songLyrics/")) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ songLyrics: [] }),
                } as Response)
            }
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ songs: mockSongs }),
            } as Response)
        })
        globalThis.fetch = localFetch as unknown as typeof fetch

        render(
            <MemoryRouter>
                <Settings />
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(screen.getByText("Tengir Azun")).toBeInTheDocument()
        })

        fireEvent.click(screen.getAllByRole("button", { name: /Edit/i })[0])

        expect(await screen.findByLabelText(/Language/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Lyrics/i)).toBeInTheDocument()
        expect(
            screen.queryByRole("button", { name: /Cancel/i }),
        ).not.toBeInTheDocument()
    })

    it("saves a new lyric with a POST request when the song has no lyrics", async () => {
        const localFetch = vi.fn((url: string) => {
            if (url.includes("/songLyrics/")) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ songLyrics: [] }),
                } as Response)
            }
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ songs: mockSongs }),
            } as Response)
        })
        globalThis.fetch = localFetch as unknown as typeof fetch

        render(
            <MemoryRouter>
                <Settings />
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(screen.getByText("Tengir Azun")).toBeInTheDocument()
        })

        fireEvent.click(screen.getAllByRole("button", { name: /Edit/i })[0])

        const languageInput = await screen.findByLabelText(/Language/i)
        fireEvent.change(languageInput, { target: { value: "Kazakh" } })
        const textarea = screen.getByLabelText(/Lyrics/i)
        fireEvent.change(textarea, { target: { value: "New lyric text" } })
        const form = textarea.closest("form") as HTMLFormElement
        fireEvent.click(within(form).getByRole("button", { name: /^Save$/ }))

        await waitFor(() => {
            expect(localFetch).toHaveBeenCalledWith(
                expect.stringContaining("/api/data/songLyrics"),
                expect.objectContaining({ method: "POST" }),
            )
        })
    })

    it("saves song metadata with a PATCH request", async () => {
        render(
            <MemoryRouter>
                <Settings />
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(screen.getByText("Tengir Azun")).toBeInTheDocument()
        })

        fireEvent.click(screen.getAllByRole("button", { name: /Edit/i })[0])
        const titleInput = await screen.findByLabelText(/Song Title/i)
        fireEvent.change(titleInput, { target: { value: "New Title" } })
        fireEvent.click(screen.getByRole("button", { name: /^Save$/ }))

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining("/api/data/songs/1"),
                expect.objectContaining({ method: "PATCH" }),
            )
        })
    })

    it("saves lyric changes with a PATCH request", async () => {
        render(
            <MemoryRouter>
                <Settings />
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(screen.getByText("Tengir Azun")).toBeInTheDocument()
        })

        fireEvent.click(screen.getAllByRole("button", { name: /Edit/i })[0])
        fireEvent.click(
            (
                await screen.findAllByRole("button", {
                    name: /Edit Lyrics/i,
                })
            )[0],
        )

        const form = screen
            .getByLabelText(/Kazakh Lyrics/i)
            .closest("form") as HTMLFormElement
        const textarea = within(form).getByLabelText(/Kazakh Lyrics/i)
        fireEvent.change(textarea, { target: { value: "Updated text" } })
        fireEvent.click(within(form).getByRole("button", { name: /^Save$/ }))

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining("/api/data/songLyrics/1"),
                expect.objectContaining({ method: "PATCH" }),
            )
        })
    })

    it("deletes a song after confirmation", async () => {
        vi.spyOn(window, "confirm").mockReturnValue(true)

        render(
            <MemoryRouter>
                <Settings />
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(screen.getByText("Tengir Azun")).toBeInTheDocument()
        })

        fireEvent.click(screen.getAllByRole("button", { name: /Delete/i })[0])

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining("/api/data/songs/1"),
                expect.objectContaining({ method: "DELETE" }),
            )
        })
    })

    it("opens the export URL when Export Data is clicked", async () => {
        const openSpy = vi.spyOn(window, "open").mockReturnValue(null)

        render(
            <MemoryRouter>
                <Settings />
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalled()
        })

        fireEvent.click(screen.getByRole("button", { name: /Export Data/i }))

        expect(openSpy).toHaveBeenCalledWith(
            expect.stringContaining("/api/export"),
            "_blank",
        )
    })
})
