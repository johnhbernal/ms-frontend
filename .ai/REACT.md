# React specialist — ms-frontend

## Constraints

- **Pin React 18** (`react` / `react-dom` `^18.3.1`) for CRA 5 compatibility.
- Do **not** migrate to Vite in drive-by PRs.
- Do **not** eject CRA unless explicitly requested.

## Patterns

- Routes live in `src/App.js` (`BrowserRouter` + `Routes`).
- Protected pages wrap with `PrivateRoute` (token present **and** not expired).
- Auth helpers: `src/services/authService.js` (`saveToken` / `getToken` / `isTokenExpired` / `renewToken`).
- JWT payload decoding must use **base64url** (`-`→`+`, `_`→`/`, pad `=`).
- Forms: `react-hook-form` + yup resolvers; Spanish validation messages match existing UI.
- UI: Bootstrap 5 + `react-bootstrap`; design tokens in `src/index.css` (Inter via Google Fonts).

## Testing

- Jest + Testing Library via `react-scripts test`.
- Prefer asserting real UI (e.g. Login "Iniciar sesión") over CRA boilerplate.
- In CI / local gate: `CI=true npm test -- --watchAll=false` (PowerShell: `$env:CI='true'`).
- Keep `jest.moduleNameMapper` + `TextEncoder` polyfill in `setupTests.js` for react-router v7 under CRA.

## Out of scope

- New product features without a request.
- React 19 or concurrent-only APIs that break CRA 5.
