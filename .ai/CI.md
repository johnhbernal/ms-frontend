# CI — ms-frontend

## Rule

**CI must pass locally before push.** Use `npm run ci:local` (or the manual steps below). Do not push a red gate.

## Ports

| Process | Port |
|---------|------|
| Frontend (CRA / Playwright `baseURL`) | `3000` |
| ms-auth | `8081` |
| Practica API | `8082` |

## Workflow (GitHub Actions)

File: `.github/workflows/ci.yml`

| Step | Command |
|------|---------|
| Node | 22 (`actions/setup-node@v4`, npm cache) |
| Install | `npm ci` |
| Test | `npm test -- --watchAll=false` with `CI=true` |
| Build | `npm run build` |

`FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` is set so GitHub Actions JS runners that require Node 24 stay compatible.

## Local parity

```powershell
npm ci
# Windows PowerShell — Jest needs CI=true or it stays in watch mode:
$env:CI='true'; npm test -- --watchAll=false
npm run build

# Optional browsers (once per machine):
npx playwright install chromium

# Full local gate (Jest + build + E2E without backend):
npm run ci:local

# All Playwright specs (auth-flow skips if :8081 is down):
npm run test:e2e
```

bash equivalent for Jest:

```bash
CI=true npm test -- --watchAll=false
```

If `npm install` / `npm ci` fails on peer deps with CRA 5, use `--legacy-peer-deps` once and document why.

## Playwright

| Item | Value |
|------|--------|
| Config | `playwright.config.js` |
| `baseURL` | `http://localhost:3000` |
| Browser | Chromium |
| `testDir` | `tests/e2e` |
| `webServer` | `npm start` |
| Screenshots | on failure (`only-on-failure`); visual smoke baseline under `tests/e2e` |

Ignored artifacts: `test-results/`, `playwright-report/` (see `.gitignore`).

## CRA + react-router v7 (Jest)

CRA’s Jest does not resolve RR7 `exports` cleanly. `package.json` maps:

- `react-router-dom` → `dist/index.js`
- `react-router/dom` → `dist/development/dom-export.js`
- `react-router` → `dist/development/index.js`

`src/setupTests.js` polyfills `TextEncoder` / `TextDecoder` for RR7 under jsdom.

## Agent checklist

1. Keep `package-lock.json` in sync after dependency changes — **always** run `npm ci` locally before push (parity with GHA).
2. Do not skip hooks (`--no-verify`) in CI or commits.
3. Fail the job on test or build errors — no `continue-on-error` for the main gate.
4. Prefer Node 20 or 22 LTS in CI even if developers use Node 24 locally.
5. Run `npm run ci:local` (or Jest + build + non-backend Playwright) before push.
6. **After every push:** open the Actions URL. Red → read logs → classify → fix → local verify → push.

## Distinguishing failure types

| Symptom | Cause | Action |
|---------|--------|--------|
| *job was not acquired by Runner…* | GitHub hosted-runner queue — not code | `gh run rerun <id> --failed` |
| `npm ci` / Missing `yaml@2.9.0` (or lock out of sync) | Lockfile incomplete vs Node 22 npm | `npm install` + commit `package-lock.json`; pin peer `yaml@2.9.0` if needed |
| Jest/build/Playwright assertion fail | Real product/test bug | Fix locally with `ci:local` |

## Known lockfile note

CRA 5 pulls `tailwindcss` → `postcss-load-config@6` which peer-depends on `yaml@^2.4.2`. Direct `devDependency` `yaml@2.9.0` keeps `npm ci` green on GitHub Node 22.
