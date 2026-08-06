# ms-frontend — AI Agents

React SPA for Practica system parameters. Coordinates with `ms-auth` (JWT) and the Practica API.

## Roles

| Role | Focus | Doc |
|------|--------|-----|
| React specialist | Vite 6, React 18, routing, forms, Bootstrap UI | [REACT.md](REACT.md) |
| UX / Design | Discoverability AuthZ, i18n, OK/DENY | [DESIGN.md](DESIGN.md) |
| QA | Vitest + Playwright; API ≠ visual (Kilele) | [QA.md](QA.md) |
| Security | Auth tokens, CSP, XSS, secrets | [SECURITY.md](SECURITY.md) |
| CI / DevOps | GitHub Actions, Node pin, build/test gate | [CI.md](CI.md) |

**Council stack:** `../practica-stack/.ai/AGENTS.md`

## Stack (binding)

- **React 18** + **Vite 6** (`vite`, `@vitejs/plugin-react`) — do not bump to React 19 without verifying Vite/React plugin support
- react-router-dom 7, react-bootstrap 5, axios, react-hook-form + yup
- Session JWT in `sessionStorage` key **`token`**
- Unit tests: Vitest + Testing Library

## Rules

1. Do what was asked; nothing more.
2. Prefer editing existing files; no drive-by refactors.
3. Never commit secrets or `.env*` with credentials.
4. Validate at boundaries (forms, API responses).
5. Keep `PrivateRoute` + `isTokenExpired` as the auth gate for protected routes.
6. Run `CI=true npm test` and `npm run build` after substantive changes.
7. Env vars: `VITE_AUTH_API_URL`, `VITE_PRACTICA_API_URL` (not `REACT_APP_*`).

## Related services

| Service | Default |
|---------|---------|
| ms-auth | `http://localhost:8081` (`VITE_AUTH_API_URL`) |
| Practica API | `http://localhost:8082/api` (`VITE_PRACTICA_API_URL`) |
