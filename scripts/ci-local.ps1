# Local CI gate for ms-frontend (PowerShell).
# Parity with .github/workflows/ci.yml: npm ci → test (CI=true) → build.
# Extended: Playwright specs (optional backends).
# Run: npm run ci:local
# Optional: -SkipNpmCi when node_modules already matches the lockfile.

param(
    [switch]$SkipNpmCi,
    [switch]$SkipE2E
)

$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)

function Invoke-NpmCiRobust {
    npm ci
    if ($LASTEXITCODE -eq 0) { return }
    # Windows often hits ENOTEMPTY on node_modules\.cache during npm ci
    Write-Host 'npm ci failed; wiping node_modules and retrying once...' -ForegroundColor Yellow
    if (Test-Path node_modules) {
        Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
    }
    npm ci
    if ($LASTEXITCODE -ne 0) {
        Write-Host 'Hint: close IDE/antivirus locks on node_modules, then retry.' -ForegroundColor Yellow
        exit $LASTEXITCODE
    }
}

if (-not $SkipNpmCi) {
    Write-Host '==> npm ci (must match GitHub Actions Node 22)' -ForegroundColor Cyan
    Invoke-NpmCiRobust
} else {
    Write-Host '==> Skipping npm ci (-SkipNpmCi)' -ForegroundColor DarkGray
}

Write-Host '==> Vitest (CI=true)' -ForegroundColor Cyan
$env:CI = 'true'
npm test
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host '==> Production build' -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

if ($SkipE2E) {
    Write-Host '==> Skipping Playwright (-SkipE2E)' -ForegroundColor DarkGray
    Write-Host 'Local CI passed (unit + build).' -ForegroundColor Green
    exit 0
}

Write-Host '==> Playwright E2E (reuse local :3000 if already up)' -ForegroundColor Cyan
Remove-Item Env:CI -ErrorAction SilentlyContinue
npx playwright test tests/e2e/login-ux.spec.js tests/e2e/visual-smoke.spec.js
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host '==> Playwright Parametros UX (skip if auth down)' -ForegroundColor Cyan
npx playwright test tests/e2e/parametros-ux.spec.js tests/e2e/auth-flow.spec.js
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host 'Local CI passed.' -ForegroundColor Green
