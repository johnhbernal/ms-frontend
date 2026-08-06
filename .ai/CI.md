# CI — ms-frontend

## Workflow

File: `.github/workflows/ci.yml`

| Step | Command |
|------|---------|
| Node | 22 (`actions/setup-node@v4`, npm cache) |
| Install | `npm ci` |
| Test | `npm test -- --watchAll=false` with `CI=true` |
| Build | `npm run build` |

`FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` is set so GitHub Actions JS runners that require Node 24 stay compatible.

## Local parity

```bash
npm ci
# Windows PowerShell:
$env:CI='true'; npm test -- --watchAll=false
npm run build
```

If `npm install` / `npm ci` fails on peer deps with CRA 5, use `--legacy-peer-deps` once and document why.

## CRA + react-router v7 (Jest)

CRA’s Jest does not resolve RR7 `exports` cleanly. `package.json` maps:

- `react-router-dom` → `dist/index.js`
- `react-router/dom` → `dist/development/dom-export.js`
- `react-router` → `dist/development/index.js`

`src/setupTests.js` polyfills `TextEncoder` / `TextDecoder` for RR7 under jsdom.

## Agent checklist

1. Keep `package-lock.json` in sync after dependency changes.
2. Do not skip hooks (`--no-verify`) in CI or commits.
3. Fail the job on test or build errors — no `continue-on-error` for the main gate.
4. Prefer Node 20 or 22 LTS in CI even if developers use Node 24 locally.
