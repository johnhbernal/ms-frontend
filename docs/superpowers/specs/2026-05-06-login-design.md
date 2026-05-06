# Login Feature Design
**Date:** 2026-05-06  
**Scope:** Spring Boot login endpoint + React login page

---

## Overview

Add a `POST /auth/login` endpoint to ms-practica and a React login page to ms-frontend. The page uses a split-screen layout (Corporate Blue) and submits credentials that are validated against hardcoded values in `application.yml`. On success, a JWT is returned and stored client-side; the user is redirected to the home route.

---

## Architecture

```
React LoginPage
  → POST http://localhost:8080/auth/login  { username, password }
  → Spring Boot AuthController
      validates against app.auth.username / app.auth.password (yml)
      calls jwtValidationUtil.generarToken(username)
  ← ResponseDTO { code: "200", data: { token, username } }
  → stored in localStorage (remember me ON) or sessionStorage (OFF)
  → redirect to /
```

---

## Backend Changes (ms-practica)

### New files
| File | Purpose |
|---|---|
| `dto/LoginRequestDTO.java` | `{ username, password }` request body |
| `dto/LoginResponseDTO.java` | `{ token, username }` response payload |
| `controller/AuthController.java` | Interface: `POST /auth/login` |
| `controller/impl/AuthControllerImpl.java` | Implementation |

### Modified files
| File | Change |
|---|---|
| `config/SecurityConfig.java` | Add `/auth/**` to `permitAll()` |
| `src/main/resources/properties/application.dev.yml` | Add `app.auth.username` and `app.auth.password` |
| `src/main/resources/properties/application.prod.yml` | Same, different values |

### Endpoint
```
POST /auth/login
Content-Type: application/json

Request:  { "username": "admin", "password": "secret" }
Response 200: { "code": "200", "description": "OK", "data": { "token": "eyJ...", "username": "admin" } }
Response 401: { "code": "401", "description": "Credenciales inválidas" }
```

### Credentials config (application.dev.yml)
```yaml
app:
  auth:
    username: admin
    password: admin123
```

---

## Frontend Changes (ms-frontend)

### New files
| File | Purpose |
|---|---|
| `src/services/authService.js` | Axios POST to `/auth/login`, token storage helpers |
| `src/pages/LoginPage.jsx` | Full split-screen login page |
| `src/components/PrivateRoute.jsx` | Redirects to `/login` if no token |

### Modified files
| File | Change |
|---|---|
| `src/App.js` | React Router setup: `/login` (public), `/` (protected) |
| `src/index.js` | Import Bootstrap CSS |

### UI Design
- **Layout:** Split screen — left panel (branding) + right panel (form)
- **Colors:** Corporate Blue — left: `linear-gradient(160deg, #1e3a5f, #2563eb)` / right: `#f0f4ff`
- **Left panel:** Shield icon + `MS Practica` title + `Gestión de Parámetros del Sistema` tagline
- **Right panel:** `Iniciar Sesión` heading, username field, password field with show/hide toggle, remember me checkbox, submit button

### Form validation (react-hook-form + yup)
```js
username: string().required('El usuario es obligatorio')
password: string().required('La contraseña es obligatoria').min(6, 'Mínimo 6 caracteres')
```

### States
| State | Behavior |
|---|---|
| Default | Form enabled, button active |
| Submitting | Button shows spinner, form disabled |
| Error | Red Bootstrap Alert below button — shows `description` from ResponseDTO, or "Error de conexión" on network failure |
| Success | Token stored, redirect to `/` |

### Token storage
- `remember me` checked → `localStorage.setItem('token', ...)`
- `remember me` unchecked → `sessionStorage.setItem('token', ...)`
- `authService.getToken()` checks both storages

---

## Out of Scope
- User registration
- Forgot password / password reset
- Role-based authorization
- Real user table / database-backed credentials
- Token refresh

---

## Acceptance Criteria
- [ ] `POST /auth/login` with valid credentials returns 200 + JWT
- [ ] `POST /auth/login` with invalid credentials returns 401
- [ ] `/auth/login` is publicly accessible (no JWT required)
- [ ] Login page renders split-screen layout with Corporate Blue colors
- [ ] Form validates username (required) and password (required, min 6)
- [ ] Show/hide toggle works on password field
- [ ] Remember me stores token in localStorage vs sessionStorage
- [ ] Successful login redirects to `/`
- [ ] Failed login shows error Alert
- [ ] Navigating to `/` without a token redirects to `/login`
