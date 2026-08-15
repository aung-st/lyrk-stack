# Deployment

## Prerequisites

Docker with Docker Compose. The compose file uses the modern `services:` key,
so a recent Docker version works out of the box.

## Environment Variables

Copy `.env.example` to `.env` and adjust if needed:

| Variable               | Description                                                                                                    | Default                 |
| ---------------------- | -------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `NETWORK_MODE`         | Network mode for the e2e Playwright container. `host` is required so the tests can reach `localhost` services. | `host`                  |
| `VITE_CLIENT_BASE_URL` | Public URL of the frontend.                                                                                    | `http://localhost:5173` |
| `VITE_SERVER_BASE_URL` | Public URL of the backend.                                                                                     | `http://localhost:3001` |
| `VITE_SONGS_URL`       | API path for songs.                                                                                            | `/api/data/songs`       |
| `VITE_SONG_LYRICS_URL` | API path for song lyrics.                                                                                      | `/api/data/songLyrics`  |

The `VITE_*` variables are passed to the frontend and backend containers, so
they must be set before the containers are built/started.

## Starting the Stack

```sh
docker compose up -d lyrk-stack-backend lyrk-stack-frontend-dev
```

Then open http://localhost:5173.

## Services

| Service                   | Description                                                                                                                                         |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lyrk-stack-backend`      | Express + SQLite API on port 3001. Data lives in the `lyrk-data` volume mounted at `/app/data`. Restarts automatically (`restart: unless-stopped`). |
| `lyrk-stack-frontend-dev` | Vite dev server on port 5173 with HMR. Bind-mounts host source (`src/`, `index.html`, `vite.config.ts`, tsconfigs). Restarts automatically.         |
| `lyrk-stack-frontend`     | Production build served with `serve`. Same port 5173 — do not run it at the same time as `lyrk-stack-frontend-dev`.                                 |
| `playwright`              | On-demand e2e runner. Not started by default.                                                                                                       |

## First Boot

There is no migration step. On first boot the backend creates the database
inside the volume if it does not exist. Verify the stack is healthy:

```sh
docker compose ps
curl http://localhost:3001/api/data/songs
```

## Rebuilding After Changes

- **Frontend source (`src/`)** — Vite HMR picks changes up automatically.
- **Backend source (`api/`)** — the backend image bakes the `api/` directory, so changes require:
    ```sh
    docker compose up -d --build lyrk-stack-backend
    ```
- **E2E tests or Playwright config** — see [Development](DEVELOPMENT.md); the `playwright` image must be rebuilt.

## Persistence

All data lives in the named volume `lyrk-stack_lyrk-data`. It survives
container rebuilds and `docker compose up` / `docker compose down`. It is only
destroyed by:

```sh
docker compose down -v
# or
docker volume rm lyrk-stack_lyrk-data
```

See [Backup & Restore](BACKUP.md) for how to back up and recover this data.
