import { test, expect } from "@playwright/test"

const clientBaseURL: string = process.env.VITE_CLIENT_BASE_URL!

test("navigates from the songs list to a song", async ({ page }) => {
    await page.goto(`${clientBaseURL}/songs`)

    const firstSongLink = page.locator(".songs-list a").first()
    await expect(firstSongLink).toBeVisible()

    await firstSongLink.click()

    await expect(page.locator(".song-header h1")).toBeVisible()
})

test("rejects adding a song with a blank title", async ({ page }) => {
    await page.goto(`${clientBaseURL}/add-song`)

    await page.locator("#song-title").fill("   ")
    await page.locator("#artist-name").fill("E2E Test Artist")
    await page.locator("#language").fill("EN")
    await page.locator("#lyrics-text").fill("test lyrics")

    await page.getByRole("button", { name: "Add", exact: true }).click()

    await expect(page.locator(".error-message")).toHaveText("Failed to add song")
})
