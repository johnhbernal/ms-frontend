# CI — ms-frontend

## Rule

**CI must pass locally before push.** Use `npm run ci:local` (or the manual steps below). Do not push a red gate.

## Ports

| Process | Port |
|---------|------|
| Frontend (Vite dev / Playwright `baseURL`) | `3000` |
| ms-auth | `8081` |
| Practica API | `8082` |

## Workflow (GitHub Actions)

File: `.github/workflows/ci.yml`

| Step | Command |
|------|---------|
| Node | 22 (`actions/setup-node@v4`, npm cache) |
| Install | `npm ci` |
| Test | `npm test` with `CI=true` (Vitest run mode) |
| Build | `npm run build` |

Optional locally: `npm run lint` (not in GHA job yet).

`FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` is set so GitHub Actions JS runners that require Node 24 stay compatible.

## Docker

| Item | Value |
|------|--------|
| Image | Multi-stage: `node:22-alpine` build → `nginxinc/nginx-unprivileged:1.27-alpine` |
| Port | Host `3000` → container `8080` (`docker-compose.yml`) |
| Health | `GET /health` (nginx) |
| SPA | `try_files` history fallback — see `docker/nginx.conf` |
| Build args | `VITE_AUTH_API_URL`, `VITE_PRACTICA_API_URL` (browser-reachable URLs) |
| Output | `/dist` copied to nginx html root |

## Local parity

```powershell
npm ci
$env:CI='true'; npm test
npm run build

# Optional browsers (once per machine):
npx playwright install chromium

# Full local gate (Vitest + build + E2E without backend):
npm run ci:local

# All Playwright specs (auth-flow skips if :8081 is down):
npm run test:e2e
```

bash equivalent:

```bash
CI=true npm test
npm run build
```

## Playwright

| Item | Value |
|------|--------|
| Config | `playwright.config.cjs` |
| `baseURL` | `http://localhost:3000` |
| Browser | Chromium |
| `testDir` | `tests/e2e` |
| `webServer` | `npm run dev` |
| Screenshots | on failure (`only-on-failure`); visual smoke baseline under `tests/e2e` |

Ignored artifacts: `test-results/`, `playwright-report/` (see `.gitignore`).

## Vitest + react-router v7

`vite.config.js` aliases RR7 package exports for Vitest/jsdom (same paths formerly in Jest `moduleNameMapper`).

`src/setupTests.js` polyfills `TextEncoder` / `TextDecoder` for RR7 under jsdom.

## Agent checklist

1. Keep `package-lock.json` in sync after dependency changes — **always** run `npm ci` locally before push (parity with GHA).
2. Do not skip hooks (`--no-verify`) in CI or commits.
3. Fail the job on test or build errors — no `continue-on-error` for the main gate.
4. Prefer Node 20 or 22 LTS in CI even if developers use Node 24 locally.
5. Run `npm run ci:local` (or Vitest + build + non-backend Playwright) before push.
6. **After every push:** open the Actions URL. Red → read logs → classify → fix → local verify → push.

## Distinguishing failure types

| Symptom | Cause | Action |
|---------|--------|--------|
| *job was not acquired by Runner…* | GitHub hosted-runner queue — not code | `gh run rerun <id> --failed` |
| `npm ci` / lock out of sync | Lockfile incomplete vs Node 22 npm | `npm install` + commit `package-lock.json` |
| Vitest/build/Playwright assertion fail | Real product/test bug | Fix locally with `ci:local` |
