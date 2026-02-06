import { test, expect } from "@playwright/test"

const clientBaseURL: string = process.env.VITE_CLIENT_BASE_URL!

test("has title", async ({ page }) => {
    await page.goto(clientBaseURL)

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Lyrk Stack/)
})
