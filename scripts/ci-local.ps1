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

Write-Host '==> Playwright E2E (no backend required)' -ForegroundColor Cyan
npx playwright test tests/e2e/login-ux.spec.js tests/e2e/visual-smoke.spec.js
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host 'Local CI passed.' -ForegroundColor Green
