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

## How to run

```bash
npm install
npm start
# App starts on http://localhost:3000
```

## Environment variables

Create a `.env.local` file to override defaults:

```
REACT_APP_AUTH_API_URL=http://localhost:8081
REACT_APP_PRACTICA_API_URL=http://localhost:8082/api
```

## Required services (ports)

| Service | Port | Default URL |
|---------|------|-------------|
| ms-frontend (CRA) | **3000** | http://localhost:3000 |
| ms-auth | **8081** | http://localhost:8081 |
| Practica API | **8082** | http://localhost:8082/api |

## Session management

- JWT stored in `sessionStorage` under key `token` (cleared on tab close)
- Token expiry checked before every API request; expired session redirects to `/login`
- Auto-renewal: token is silently renewed 3 minutes before expiry
- Warning banner shown 1 minute before expiry if renewal fails
- Green banner confirms successful renewal

## Tests & local CI

**CI must pass locally before push.**

### Jest (unit)

PowerShell (CRA watches unless `CI` is set):

```powershell
$env:CI='true'; npm test -- --watchAll=false
```

bash / Git Bash:

```bash
CI=true npm test -- --watchAll=false
```

### Playwright E2E / visual

```bash
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

Runs Jest (`$env:CI='true'`), production build, and Playwright specs that do not need the backend (`login-ux` + `visual-smoke`).

## Production build

```bash
npm run build
# Output in /build — serve with any static file server
```
