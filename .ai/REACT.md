# React specialist — ms-frontend

## Constraints

- **Pin React 18** (`react` / `react-dom` `^18.3.1`).
- **Vite 6** + `@vitejs/plugin-react` — dev server and build tool.
- Do **not** bump to React 19 without verifying Vite/React plugin support.

## Patterns

- Entry: `index.html` → `src/index.jsx` → `App.jsx`.
- Routes live in `src/App.jsx` (`BrowserRouter` + `Routes`).
- Protected pages wrap with `PrivateRoute` (token present **and** not expired).
- Auth helpers: `src/services/authService.js` (`saveToken` / `getToken` / `isTokenExpired` / `renewToken`).
- JWT payload decoding must use **base64url** (`-`→`+`, `_`→`/`, pad `=`).
- Forms: `react-hook-form` + yup resolvers; Spanish validation messages match existing UI.
- UI: Bootstrap 5 + `react-bootstrap`; design tokens in `src/index.css` (Inter via Google Fonts).
- Env: `import.meta.env.VITE_*` (not `process.env.REACT_APP_*`).

## Testing

- Vitest + Testing Library (`npm test` / `vitest run`).
- Prefer asserting real UI (e.g. Login "Iniciar sesión") over boilerplate.
- In CI / local gate: `CI=true npm test` (PowerShell: `$env:CI='true'`).
- Keep RR7 resolve aliases + `TextEncoder` polyfill in `vite.config.js` / `setupTests.js`.

## Out of scope

- New product features without a request.
- React 19 or concurrent-only APIs without verifying toolchain support.
