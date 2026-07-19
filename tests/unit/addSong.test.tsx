import { vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"

import AddSong from "../../src/pages/AddSong"

beforeEach(() => {
    globalThis.fetch = vi.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({ songs: [] }),
        } as Response),
    )
})

afterEach(() => {
    vi.restoreAllMocks()
})

describe("AddSong Page", () => {
    it("renders the add song heading", async () => {
        render(
            <MemoryRouter>
                <AddSong />
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalled()
        })

        expect(
            screen.getByRole("heading", { name: /Add Song/i }),
        ).toBeInTheDocument()
    })

    it("renders the mode toggle buttons", async () => {
        render(
            <MemoryRouter>
                <AddSong />
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalled()
        })

        expect(screen.getByRole("button", { name: /New Song/i })).toBeInTheDocument()
        expect(
            screen.getByRole("button", { name: /Add Translation/i }),
        ).toBeInTheDocument()
    })

    it("defaults to new song mode with title and artist inputs", async () => {
        render(
            <MemoryRouter>
                <AddSong />
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalled()
        })

        expect(screen.getByLabelText(/Song Title/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Artist/i)).toBeInTheDocument()
    })

    it("switches to translation mode with song selector", async () => {
        render(
            <MemoryRouter>
                <AddSong />
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalled()
        })

        fireEvent.click(screen.getByRole("button", { name: /Add Translation/i }))

        expect(screen.getByLabelText(/Select Song/i)).toBeInTheDocument()
        expect(screen.queryByLabelText(/Song Title/i)).not.toBeInTheDocument()
    })

    it("renders language and lyrics inputs in both modes", async () => {
        render(
            <MemoryRouter>
                <AddSong />
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalled()
        })

        expect(screen.getByLabelText(/Language/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Lyrics/i)).toBeInTheDocument()
    })

    it("renders the translation checkbox", async () => {
        render(
            <MemoryRouter>
                <AddSong />
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalled()
        })

        expect(screen.getByLabelText(/This is a translation/i)).toBeInTheDocument()
    })

    it("renders the submit button", async () => {
        render(
            <MemoryRouter>
                <AddSong />
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalled()
        })

        expect(screen.getByRole("button", { name: /^Add$/ })).toBeInTheDocument()
    })

    it("fetches songs on mount for the translation dropdown", async () => {
        render(
            <MemoryRouter>
                <AddSong />
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledTimes(1)
        })
    })
})
