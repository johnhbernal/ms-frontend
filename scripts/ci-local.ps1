# Local CI gate for ms-frontend (PowerShell).
# Run: npm run ci:local
# Or:  powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/ci-local.ps1

$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)

Write-Host '==> Jest (CI=true)' -ForegroundColor Cyan
$env:CI = 'true'
npm test -- --watchAll=false
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host '==> Production build' -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host '==> Playwright E2E (reuse local :3000 if already up)' -ForegroundColor Cyan
# Do not leave CI=true — Playwright would refuse reuseExistingServer and fail if npm start is already running.
Remove-Item Env:CI -ErrorAction SilentlyContinue
npx playwright test tests/e2e/login-ux.spec.js tests/e2e/visual-smoke.spec.js
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# Optional: full UX with backends (skips cleanly if ms-auth is down)
Write-Host '==> Playwright Parámetros UX (skip if auth down)' -ForegroundColor Cyan
npx playwright test tests/e2e/parametros-ux.spec.js tests/e2e/auth-flow.spec.js
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host 'Local CI passed.' -ForegroundColor Green
