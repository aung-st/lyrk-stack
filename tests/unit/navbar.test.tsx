import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"

import Navbar from "../../src/components/Navbar"

describe("Navbar Component", () => {
    it("renders the About button with correct text", () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>,
        )

        const aboutButton = screen.getByRole("button", { name: /About/i })
        expect(aboutButton).toBeInTheDocument()
        expect(aboutButton).toHaveTextContent("About")
    })
    it("renders the Songs button with correct text", () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>,
        )

        const aboutButton = screen.getByRole("button", { name: /Songs/i })
        expect(aboutButton).toBeInTheDocument()
        expect(aboutButton).toHaveTextContent("Songs")
    })
    it("renders the Home button with correct text", () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>,
        )

        const aboutButton = screen.getByRole("button", { name: /Home/i })
        expect(aboutButton).toBeInTheDocument()
        expect(aboutButton).toHaveTextContent("Home")
    })
    it("renders the Add Song button with correct text", () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>,
        )

        const aboutButton = screen.getByRole("button", { name: /Add Song/i })
        expect(aboutButton).toBeInTheDocument()
        expect(aboutButton).toHaveTextContent("Add Song")
    })
})
