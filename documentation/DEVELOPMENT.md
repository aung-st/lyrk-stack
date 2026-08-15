# Development

## Dev Loop

Start the stack once:

```sh
docker compose up -d lyrk-stack-backend lyrk-stack-frontend-dev
```

Frontend changes under `src/` are hot-reloaded by Vite (HMR) — just edit and
refresh http://localhost:5173.

Backend changes under `api/` require a rebuild:

```sh
docker compose up -d --build lyrk-stack-backend
```

## Linting and Formatting

```sh
npm run lint
npm run format
```

Both run automatically on staged files before every commit (lint-staged +
husky).

## Unit Tests

```sh
npm run test          # vitest, once
npm run test:watch    # vitest, watch mode
```

## End-to-End Tests

E2E tests live in `tests/e2e/` and run inside a Playwright container against
the running stack (chromium, firefox, webkit):

```sh
npm run e2e
```
