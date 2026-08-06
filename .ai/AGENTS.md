# ms-frontend — AI Agents

React SPA for Practica system parameters. Coordinates with `ms-auth` (JWT) and the Practica API.

## Roles

| Role | Focus | Doc |
|------|--------|-----|
| React specialist | CRA 5, React 18, routing, forms, Bootstrap UI | [REACT.md](REACT.md) |
| Security | Auth tokens, CSP, XSS, secrets | [SECURITY.md](SECURITY.md) |
| CI / DevOps | GitHub Actions, Node pin, build/test gate | [CI.md](CI.md) |

## Stack (binding)

- **React 18** + Create React App 5 (`react-scripts` 5.0.1) — do not upgrade to React 19 without migrating off CRA
- react-router-dom 7, react-bootstrap 5, axios, react-hook-form + yup
- Session JWT in `sessionStorage` key **`token`**

## Rules

1. Do what was asked; nothing more.
2. Prefer editing existing files; no drive-by refactors.
3. Never commit secrets or `.env*` with credentials.
4. Validate at boundaries (forms, API responses).
5. Keep `PrivateRoute` + `isTokenExpired` as the auth gate for protected routes.
6. Run `CI=true npm test -- --watchAll=false` and `npm run build` after substantive changes.
7. Vite migration is out of scope unless explicitly requested.

## Related services

| Service | Default |
|---------|---------|
| ms-auth | `http://localhost:8081` (`REACT_APP_AUTH_API_URL`) |
| Practica API | `http://localhost:8082/api` (`REACT_APP_PRACTICA_API_URL`) |
