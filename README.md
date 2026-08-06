# ms-frontend

React SPA for managing Practica system parameters.

## Stack

| | |
|---|---|
| Framework | React 18 (Create React App 5) |
| UI | React Bootstrap 5 |
| Forms | react-hook-form 7 + yup |
| HTTP | axios |
| Routing | react-router-dom 7 |
| E2E | Playwright (Chromium) |
| Node (CI) | 22 (`.nvmrc`; local 20–24 supported via `engines`) |

## Quick start (local dev)

```powershell
npm ci
npm start
# → http://localhost:3000
```

Copy `.env.example` to `.env.local` to override API URLs (optional — defaults match sibling services).

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `REACT_APP_AUTH_API_URL` | `http://localhost:8081` | ms-auth base URL |
| `REACT_APP_PRACTICA_API_URL` | `http://localhost:8082/api` | Practica API base URL |

CRA bakes `REACT_APP_*` at **build time**. Rebuild (or restart `npm start`) after changing them.

## Required services (ports)

| Service | Port | Default URL |
|---------|------|-------------|
| ms-frontend (CRA dev) | **3000** | http://localhost:3000 |
| ms-frontend (Docker) | **3000** → container **8080** | http://localhost:3000 |
| ms-auth | **8081** | http://localhost:8081 |
| Practica API | **8082** | http://localhost:8082/api |

## IDE setup

| IDE | Notes |
|-----|-------|
| **Node** | Use Node 22 for CI parity (`nvm use` / `.nvmrc`). Node 24 works locally if `npm ci` passes. |
| **Cursor / VS Code** | Open folder root; ESLint via CRA `eslintConfig` in `package.json`. |
| **IntelliJ** | Mark `src` as sources; install Node plugin; set Node interpreter to 22 LTS. |

## Docker (production static serve)

Multi-stage build: Node 22 → nginx unprivileged (non-root) with SPA history fallback.

```powershell
# Frontend only (nginx on host :3000)
docker compose up --build
# → http://localhost:3000/health

# Override API URLs baked into the bundle (browser-reachable from host):
$env:REACT_APP_AUTH_API_URL='http://localhost:8081'
$env:REACT_APP_PRACTICA_API_URL='http://localhost:8082/api'
docker compose up --build
```

### Full Practica stack (three repos)

Run backends from sibling repos, then the frontend container or CRA dev server:

| Repo | Command | URL |
|------|---------|-----|
| `ms-auth` | `docker compose up --build` (set `APP_JWT_*` in `.env`) | http://localhost:8081 |
| `practica` | `docker compose up --build` (shared `APP_JWT_SECRET_SESSION`) | http://localhost:8082/api |
| `ms-frontend` | `docker compose up --build` or `npm start` | http://localhost:3000 |

Ensure `APP_CORS_ALLOWED_ORIGINS` on both backends includes `http://localhost:3000`.

## Session management

- JWT stored in `sessionStorage` under key `token` (cleared on tab close)
- Token expiry checked before every API request; expired session redirects to `/login`
- Auto-renewal: token is silently renewed 3 minutes before expiry
- Warning banner shown 1 minute before expiry if renewal fails
- Green banner confirms successful renewal

## Tests & local CI

**CI must pass locally before push.**

### GitHub Actions gate

`npm ci` → `npm test -- --watchAll=false` (`CI=true`) → `npm run build`

### Jest (unit)

```powershell
$env:CI='true'; npm test -- --watchAll=false
```

### Lint

```powershell
npm run lint
```

### Playwright E2E / visual

```powershell
npx playwright install chromium
npm run test:e2e
```

- `tests/e2e/login-ux.spec.js` — login UX (title, fields, button)
- `tests/e2e/visual-smoke.spec.js` — login screenshot
- `tests/e2e/auth-flow.spec.js` — full login (`admin` / `Admin123!`); **skipped** if ms-auth (`:8081`) is down

### Local CI gate

```powershell
npm run ci:local
```

Runs the GHA gate plus Playwright specs (backend-dependent tests skip cleanly if ms-auth is down).

If `npm ci` fails on Windows with `ENOTEMPTY`, remove `node_modules` and retry:

```powershell
Remove-Item -Recurse -Force node_modules; npm ci
```

## Production build (without Docker)

```powershell
npm ci
npm run build
# Output in /build — serve with any static file server + SPA fallback
```

For nginx, use `docker/nginx.conf` as reference (`try_files` → `/index.html`).

## Agent docs

See [`.ai/AGENTS.md`](.ai/AGENTS.md) and [`.ai/CI.md`](.ai/CI.md).
