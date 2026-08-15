# Lyrk Stack

A self-hosted song lyrics application. Browse songs and artists, add new songs
with lyrics, and read translations side by side — all running locally in Docker.

## 🧰 Tech Stack

- React + TypeScript (Vite)
- Express + Node.js
- SQLite (persisted on a Docker volume)

## 🏃 Quick Start

Prerequisites: Docker with Docker Compose.

```sh
docker compose up -d lyrk-stack-backend lyrk-stack-frontend-dev
```

## 📖 Documentation

- [Deployment](documentation/DEPLOYMENT.md) — setup, environment variables, services, persistence
- [Development](documentation/DEVELOPMENT.md) — dev loop, HMR, testing, linting
- [Backup & Restore](documentation/BACKUP.md) — backing up and restoring the database
