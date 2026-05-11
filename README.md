# ms-frontend

React SPA for managing Practica system parameters.

## Stack

| | |
|---|---|
| Framework | React 19 (Create React App) |
| UI | React Bootstrap 5 |
| Forms | react-hook-form 7 + yup |
| HTTP | axios |
| Routing | react-router-dom 7 |

## How to run

```bash
npm install
npm start
# App starts on http://localhost:3000
```

## Environment variables

Create a `.env.local` file to override defaults:

```
REACT_APP_AUTH_API_URL=http://localhost:8081
REACT_APP_PRACTICA_API_URL=http://localhost:8082/api
```

## Required services

| Service | Default URL |
|---------|-------------|
| ms-auth | http://localhost:8081 |
| Practica API | http://localhost:8082 |

## Session management

- `sessionToken` stored in `sessionStorage` (cleared on tab close)
- Token expiry checked before every API request; expired session redirects to `/login`
- Auto-renewal: token is silently renewed 3 minutes before expiry
- Warning banner shown 1 minute before expiry if renewal fails
- Green banner confirms successful renewal

## Production build

```bash
npm run build
# Output in /build — serve with any static file server
```
