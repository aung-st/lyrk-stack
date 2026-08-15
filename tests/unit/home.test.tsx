import { vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"

import Home from "../../src/pages/Home"

const mockSongs = [
    {
        song_id: 1,
        song_title: "Tengir Azun",
        artist_id: 1,
        artist_name: "Altai Kai",
    },
    { song_id: 2, song_title: "Jerim", artist_id: 2, artist_name: "Altai Kai" },
]

beforeEach(() => {
    globalThis.fetch = vi.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({ songs: mockSongs }),
        } as Response),
    )
})

afterEach(() => {
    vi.restoreAllMocks()
})

describe("Home Page", () => {
    it("renders the search input", async () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalled()
        })

        expect(screen.getByRole("textbox")).toBeInTheDocument()
    })

    it("has placeholder text in the search input", async () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalled()
        })

        expect(screen.getByPlaceholderText("Search for a song")).toBeInTheDocument()
    })

    it("fetches songs on mount", async () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledTimes(1)
        })
    })

    it("shows search results when typing a matching song title", async () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalled()
        })

        const input = screen.getByRole("textbox")
        fireEvent.change(input, { target: { value: "Ten" } })

        await waitFor(() => {
            expect(screen.getByText("Tengir Azun")).toBeInTheDocument()
        })
    })

    it("shows no results message when search has no matches", async () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalled()
        })

        const input = screen.getByRole("textbox")
        fireEvent.change(input, { target: { value: "Zzzz" } })

        await waitFor(() => {
            expect(screen.getByText("No results found")).toBeInTheDocument()
        })
    })

    it("does not show results when search is empty", async () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalled()
        })

        const input = screen.getByRole("textbox")
        fireEvent.change(input, { target: { value: "" } })

        expect(screen.queryByRole("list")).not.toBeInTheDocument()
    })

    it("renders result headers with Song and Artist columns", async () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalled()
        })

        const input = screen.getByRole("textbox")
        fireEvent.change(input, { target: { value: "Ten" } })

        await waitFor(() => {
            expect(screen.getByText("Song")).toBeInTheDocument()
            expect(screen.getByText("Artist")).toBeInTheDocument()
        })
    })

    it("renders artist name alongside song title in results", async () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalled()
        })

        const input = screen.getByRole("textbox")
        fireEvent.change(input, { target: { value: "Ten" } })

        await waitFor(() => {
            expect(screen.getByText("Tengir Azun")).toBeInTheDocument()
            expect(screen.getByText("Altai Kai")).toBeInTheDocument()
        })
    })

    it("does not show an error when the initial load fails", async () => {
        globalThis.fetch = vi.fn(() => Promise.reject(new Error("Failed to fetch")))

        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalled()
        })

        expect(screen.queryByText("Failed to fetch")).not.toBeInTheDocument()
    })

    it("shows an error when a search refetch fails", async () => {
        globalThis.fetch = vi
            .fn()
            .mockResolvedValueOnce({
                json: () => Promise.resolve({ songs: mockSongs }),
            } as Response)
            .mockRejectedValueOnce(new Error("Failed to fetch"))

        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledTimes(1)
        })

        const input = screen.getByRole("textbox")
        fireEvent.change(input, { target: { value: "T" } })

        await waitFor(() => {
            expect(screen.getByText("Failed to fetch")).toBeInTheDocument()
        })
    })

    it("shows a fallback error message when a search refetch fails", async () => {
        globalThis.fetch = vi
            .fn()
            .mockResolvedValueOnce({
                json: () => Promise.resolve({ songs: mockSongs }),
            } as Response)
            .mockRejectedValueOnce("boom")

        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledTimes(1)
        })

        const input = screen.getByRole("textbox")
        fireEvent.change(input, { target: { value: "T" } })

        await waitFor(() => {
            expect(screen.getByText("Something went wrong")).toBeInTheDocument()
        })
    })

    it("refetches songs when the query changes", async () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledTimes(1)
        })

        const input = screen.getByRole("textbox")
        fireEvent.change(input, { target: { value: "T" } })

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledTimes(2)
        })
    })

    it("clears the error when a search refetch succeeds after a failed one", async () => {
        globalThis.fetch = vi
            .fn()
            .mockResolvedValueOnce({
                json: () => Promise.resolve({ songs: mockSongs }),
            } as Response)
            .mockRejectedValueOnce(new Error("Failed to fetch"))
            .mockResolvedValueOnce({
                json: () => Promise.resolve({ songs: mockSongs }),
            } as Response)

        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledTimes(1)
        })

        const input = screen.getByRole("textbox")
        fireEvent.change(input, { target: { value: "T" } })

        await waitFor(() => {
            expect(screen.getByText("Failed to fetch")).toBeInTheDocument()
        })

        fireEvent.change(input, { target: { value: "Te" } })

        await waitFor(() => {
            expect(screen.queryByText("Failed to fetch")).not.toBeInTheDocument()
        })
    })
})
