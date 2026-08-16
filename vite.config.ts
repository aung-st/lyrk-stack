import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"

export default defineConfig({
    base: "/",
    plugins: [react()],
    preview: {
        port: 5173,
        strictPort: true,
    },
    server: {
        port: 5173,
        strictPort: true,
        host: true,
        origin: "http://0.0.0.0:5173",
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./vitest.setup.ts",
        css: true,
        env: {
            VITE_SERVER_BASE_URL: "http://localhost:3001",
            VITE_SONGS_URL: "/api/data/songs",
            VITE_SONG_LYRICS_URL: "/api/data/songLyrics",
        },
        exclude: ["tests/e2e/**", "node_modules"],
        coverage: {
            provider: "v8",
            reporter: ["text", "html"],
            include: ["src/**/*.{ts,tsx}"],
        },
    },
})
