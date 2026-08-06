# QA — ms-frontend

## Capas

| Capa | Herramienta | Acredita |
|------|-------------|----------|
| Unit | Vitest | helpers AuthZ (`hasPermission`), i18n login + `parameters.title`, `displayParamValue` |
| E2E | Playwright Chromium | AuthZ UI real contra ms-auth |
| Build | `npm run build` | Vite bundle |
| Smoke humano | Idioma EN en Parámetros/nav | Switcher ≠ i18n completo si hay strings hardcode |

**Vitest verde ≠ Administración visible** (Kilele).  
**LanguageSwitcher ≠ i18n completo** — home/modales deben usar `t()` (cerrado 2026-08-06).

## E2E obligatorio AuthZ

```powershell
npx playwright test tests/e2e/rbac-module-authz.spec.js --workers=1 --retries=0
```

Debe afirmar:

1. admin → tab Permissions + `INVENTARIO_PRECIO_READ` en `<code>`
2. seller → badges WRITE DENY + botones save disabled
3. seller → request PUT precio/stock recibe **403** (no solo UI)

Skip si `:8081` health down — no fingir PASS.
