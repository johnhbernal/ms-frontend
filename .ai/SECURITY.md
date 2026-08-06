# Security — ms-frontend

## Auth & session

- Store the JWT in `sessionStorage` under key **`token`** (tab-scoped; cleared on close).
- `PrivateRoute` must reject missing **or expired** tokens via `isTokenExpired`.
- Logout clears `token` and `expiresAtMs`; best-effort server logout to ms-auth.
- Never put tokens in `localStorage`, URLs, or logs.

## JWT handling

- Decode payloads with base64url-safe conversion before `atob`.
- Treat malformed tokens as expired / unauthenticated.
- Client-side `exp` checks are UX gates only — APIs must still enforce auth.

## CSP (`public/index.html`)

- Default deny; allow self scripts.
- Styles: `'self' 'unsafe-inline' https://fonts.googleapis.com` (Inter `@import` in `index.css`).
- Fonts: `'self' https://fonts.gstatic.com`.
- `connect-src` includes local ms-auth / Practica and `https:` for deployed APIs.
- Prefer tightening CSP over adding more CDNs. Self-hosting Inter is an acceptable alternative if CSP must stay stricter.

## Secrets

- Use `.env.local` / env vars for API base URLs only.
- Never commit credentials, private keys, or production tokens.
- No secrets in client bundles beyond public API base URLs.

## XSS / UI

- Prefer React text nodes over `dangerouslySetInnerHTML`.
- Sanitize any future HTML from APIs before render.
