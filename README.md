# ms-frontend

React SPA for the **Practica portfolio stack** — parameter management plus AuthN/AuthZ study screens (password recovery, simulated AD groups, RBAC admin).

## Stack

| | |
|---|---|
| Framework | React 18 + Vite 6 |
| UI | React Bootstrap 5 |
| Forms | react-hook-form 7 + yup |
| HTTP | axios |
| Routing | react-router-dom 7 |
| Unit tests | Vitest + Testing Library |
| E2E | Playwright (Chromium) |
| i18n | `i18next` + `react-i18next` — **es-CO** (default) and **en** |
| Node (CI) | 22 (`.nvmrc`; local 20–24 supported via `engines`) |

## Internationalization (es-CO / en)

| Locale | Code | Notes |
|--------|------|--------|
| Español (Colombia) | `es-CO` | Default / fallback |
| English | `en` | Full UI strings for portfolio demos |

- Files: `src/i18n/locales/es-CO.json`, `src/i18n/locales/en.json`
- Selector in login, shell, forgot/reset password (`LanguageSwitcher`)
- Preference persisted in `localStorage` key `practica.lang`
- Browser `es*` → `es-CO`, `en*` → `en`
- `document.documentElement.lang` updated on change

Add new copy only in **both** locale files before shipping UI text.

## Portfolio / study framing

This UI is intentionally small but realistic:

- **AuthN** — login, session JWT, forgot/reset password (ms-auth `:8081`)
- **AuthZ** — JWT carries roles/permissions; `/directory/me` shows resolved identity; `/admin/rbac` **creates** module permissions/roles and assigns them via AD-sim groups
- **Module demo** — `/inventario` uses `INVENTARIO_PRECIO_READ|WRITE` / `INVENTARIO_STOCK_WRITE` (seller = read-only prices)
- **Domain** — Practica parameters CRUD (ms-practica `:8082/api`)
- **i18n** — es-CO (default) + English

Nav “Administración” is shown when the JWT `role` is `ADMIN` **or** permissions include `GROUP_ADMIN` / `USER_ADMIN` (client-side hint only — ms-auth enforces on every API call). Inventario nav appears when the JWT has `INVENTARIO_PRECIO_READ` (or ADMIN).

## Screens & routes

| Route | Access | Purpose |
|-------|--------|---------|
| `/login` | Public | Session login |
| `/forgot-password` | Public | Request reset link (generic response) |
| `/reset-password?token=…` | Public | Set new password with one-time token |
| `/` | Authenticated | Parámetros (search, pagination, CSV export) |
| `/inventario` | `INVENTARIO_PRECIO_READ` | Demo AuthZ por módulo (VENDEDOR) |
| `/directory/me` | Authenticated | Mi directorio — groups, roles, permissions |
| `/admin/rbac` | Admin gate | Usuarios · Grupos · Roles · Permisos (crear + asignar) |

### Seed credentials (dev/stack)

| User | Password | Expect |
|------|----------|--------|
| admin | Admin123! | Admin + inventario write |
| seller | Seller123! | Inventario read prices; write → 403 |

## Quick start (local dev)

```powershell
npm ci
npm run dev
# or: npm start  (alias)
# → http://localhost:3000
```

Copy `.env.example` to `.env.local` to override API URLs (optional — defaults match sibling services).

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_AUTH_API_URL` | `http://localhost:8081` | ms-auth base URL |
| `VITE_PRACTICA_API_URL` | `http://localhost:8082/api` | Practica API base URL |

Vite bakes `VITE_*` at **build time**. Rebuild (or restart `npm run dev`) after changing them.

> **Migration note:** CRA used `REACT_APP_*`. Those names are deprecated; use `VITE_*` instead.

## Required services (ports)

| Service | Port | Default URL |
|---------|------|-------------|
| ms-frontend (Vite dev) | **3000** | http://localhost:3000 |
| ms-frontend (Docker) | **3000** → container **8080** | http://localhost:3000 |
| ms-auth | **8081** | http://localhost:8081 |
| Practica API | **8082** | http://localhost:8082/api |

## IDE setup

| IDE | Notes |
|-----|-------|
| **Node** | Use Node 22 for CI parity (`nvm use` / `.nvmrc`). Node 24 works locally if `npm ci` passes. |
| **Cursor / VS Code** | Open folder root; ESLint via `.eslintrc.cjs`. |
| **IntelliJ** | Mark `src` as sources; install Node plugin; set Node interpreter to 22 LTS. |

## Docker (production static serve)

Multi-stage build: Node 22 → nginx unprivileged (non-root) with SPA history fallback. Output served from `/dist`.

```powershell
# Frontend only (nginx on host :3000)
docker compose up --build
# → http://localhost:3000/health

# Override API URLs baked into the bundle (browser-reachable from host):
$env:VITE_AUTH_API_URL='http://localhost:8081'
$env:VITE_PRACTICA_API_URL='http://localhost:8082/api'
docker compose up --build
```

### Full Practica stack (three repos)

Preferred: sibling folder [`../practica-stack`](../practica-stack) (one compose for Postgres + auth + practica + this UI).

```powershell
cd ..\practica-stack
copy .env.example .env
powershell -File scripts\smoke-stack-docker.ps1
# → http://localhost:3000  (admin / Admin123!)
```

Or run each repo’s own `docker compose` / `npm run dev` separately. Ensure `APP_CORS_ALLOWED_ORIGINS` includes `http://localhost:3000`.

## Session management

- JWT stored in `sessionStorage` under key `token` (cleared on tab close)
- Token expiry checked before every API request; expired session redirects to `/login`
- Auto-renewal: token is silently renewed 3 minutes before expiry
- Warning banner shown 1 minute before expiry if renewal fails
- Green banner confirms successful renewal

## Password recovery (dev/stack)

1. `/forgot-password` → `POST /api/auth/forgot-password` `{ email }`
2. In dev/stack, ms-auth logs a URL like `/reset-password?token=…`
3. `/reset-password` → `POST /api/auth/reset-password` `{ token, newPassword }`

Admin user reset: `/admin/rbac` → Usuarios tab → modal → `POST /api/users/{id}/reset-password`

## Tests & local CI

**CI must pass locally before push.**

### GitHub Actions gate

`npm ci` → `npm test` (`CI=true`) → `npm run build`

### Vitest (unit)

```powershell
$env:CI='true'; npm test
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
# Output in /dist — serve with any static file server + SPA fallback
```

For nginx, use `docker/nginx.conf` as reference (`try_files` → `/index.html`).

## Agent docs

See [`.ai/AGENTS.md`](.ai/AGENTS.md) and [`.ai/CI.md`](.ai/CI.md).
