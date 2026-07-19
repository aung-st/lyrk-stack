import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"

import About from "../../src/pages/About"

describe("About Page", () => {
    it("renders the about heading", () => {
        render(
            <MemoryRouter>
                <About />
            </MemoryRouter>,
        )

        expect(screen.getByRole("heading", { name: /About/i })).toBeInTheDocument()
    })

    it("renders the description paragraphs", () => {
        render(
            <MemoryRouter>
                <About />
            </MemoryRouter>,
        )

        expect(screen.getByText(/Welcome to Lyrk Stack/)).toBeInTheDocument()
    })

    it("renders the feature list", () => {
        render(
            <MemoryRouter>
                <About />
            </MemoryRouter>,
        )

        expect(screen.getByText(/Add as many translations/)).toBeInTheDocument()
        expect(screen.getByText(/Refine translations/)).toBeInTheDocument()
        expect(screen.getByText(/Export all your song data/)).toBeInTheDocument()
    })

    it("renders the Start Adding Songs button as a link", () => {
        render(
            <MemoryRouter>
                <About />
            </MemoryRouter>,
        )

        const button = screen.getByRole("button", { name: /Start Adding Songs/i })
        expect(button).toBeInTheDocument()
    })

    it("renders the Export Data button", () => {
        render(
            <MemoryRouter>
                <About />
            </MemoryRouter>,
        )

        const button = screen.getByRole("button", { name: /Export Data/i })
        expect(button).toBeInTheDocument()
    })

    it("renders the disclaimer", () => {
        render(
            <MemoryRouter>
                <About />
            </MemoryRouter>,
        )

        expect(
            screen.getByText(/No copyright infringement is intended/),
        ).toBeInTheDocument()
    })
})
