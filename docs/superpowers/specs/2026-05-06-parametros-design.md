# Parametros Page Design
**Date:** 2026-05-06  
**Scope:** React parametros management page with app shell

---

## Overview

Add a full CRUD parametros management page to ms-frontend. The page lives inside a persistent app shell (Corporate Blue navbar + dark sidebar) and communicates with ms-practica at `http://localhost:8082/api` via `practicaService.js`.

---

## Architecture

```
App.js
  /login  → LoginPage (public)
  /       → PrivateRoute → AppShell → ParametrosPage

ParametrosPage
  → getParametros() on mount
  → buscarPorNombre(term) on search
  → createParametro(data) on modal save (new)
  → updateParametro(id, data) on modal save (edit)
  → deleteParametro(id) on deactivate confirm
  ← all via practicaService.js (BASE_URL http://localhost:8082/api)
```

---

## New Files

| File | Purpose |
|---|---|
| `src/components/AppShell.jsx` | Navbar + sidebar layout wrapper; renders `{children}` in main content area |
| `src/pages/ParametrosPage.jsx` | Table, search, loading/error states, CRUD orchestration |
| `src/components/ParametroModal.jsx` | Bootstrap Modal with react-hook-form + yup for create/edit |

## Modified Files

| File | Change |
|---|---|
| `src/App.js` | Wrap home route with `AppShell`; render `ParametrosPage` as child |
| `src/services/authService.js` | Add `getUsername()` — decodes JWT subject from stored token (`atob(token.split('.')[1])`) |

---

## AppShell

- **Navbar**: full-width, `linear-gradient(160deg, #1e3a5f, #2563eb)`, height 52px
  - Left: shield SVG + "MS Practica" (white, bold)
  - Right: username from `localStorage`/`sessionStorage` token (decoded subject) + "Cerrar sesión" link that calls `logout()` and navigates to `/login`
- **Sidebar**: fixed width 180px, background `#1e2d3d`, white text
  - Single item: "⚙ Parámetros" — active state: blue left border + `#2563eb` background
- **Content area**: `background: #f0f4ff`, `padding: 24px`, flex-grows to fill remaining width

---

## ParametrosPage

### Layout
- Page heading "Parámetros del Sistema" + "+ Nuevo Parámetro" button (top row, space-between)
- Search bar below heading: text input + "Buscar" button; empty search reloads all
- Bootstrap Table inside a white card (rounded, shadowed)

### Table columns
| Column | Source field | Notes |
|---|---|---|
| # | `parameterCode` | Row ID |
| Nombre | `parameterName` | |
| Categoría | `parameterCategory` | |
| Valor | `value` | |
| Estado | `status` | `"A"` → green badge "Activo"; `"I"` → grey badge "Inactivo" |
| Acciones | — | "Editar" button + "Desactivar" button per row |

### States
| State | Behavior |
|---|---|
| Loading | Centered Bootstrap `Spinner` in content area |
| Error | Red `Alert` with message; "Reintentar" button calls `getParametros()` again |
| Empty | Grey italic text "No se encontraron parámetros" |
| Deactivate confirm | `window.confirm("¿Desactivar este parámetro?")` before API call |

### Search
- Controlled input; on submit calls `buscarPorNombre(term)` if term non-empty, else `getParametros()`
- Search result displayed in same table; no separate state

---

## ParametroModal

Used for both create and edit. Receives `show`, `onHide`, `onSaved`, `parametro` (null = create mode).

### Form fields
| Field | Label | Validation |
|---|---|---|
| `parameterName` | Nombre | required |
| `parameterCategory` | Categoría | required |
| `value` | Valor | required |
| `status` | Estado | required; React Bootstrap `Form.Select` with options "Activo" (A) / "Inactivo" (I) |

### Validation (yup)
```js
parameterName: string().required('El nombre es obligatorio')
parameterCategory: string().required('La categoría es obligatoria')
value: string().required('El valor es obligatorio')
status: string().required().oneOf(['A', 'I'])
```

### States
| State | Behavior |
|---|---|
| Create mode | Title "Nuevo Parámetro", fields empty, status defaults to "A" |
| Edit mode | Title "Editar Parámetro", fields pre-filled from `parametro` prop |
| Saving | Submit button shows spinner + "Guardando...", form disabled |
| Error | Red `Alert` inside modal footer area |
| Success | Calls `onSaved()` → parent refreshes list and closes modal |

---

## Out of Scope
- Pagination
- Column sorting
- Role-based visibility
- Bulk operations
- Reactivating an inactive parameter (deactivate only)

---

## Acceptance Criteria
- [ ] App shell renders on all protected routes with navbar + sidebar
- [ ] Navigating to `/` without token redirects to `/login`
- [ ] Logout clears token and redirects to `/login`
- [ ] Table loads all parametros on mount
- [ ] Search by name filters the table
- [ ] Empty search reloads all parametros
- [ ] "+ Nuevo Parámetro" opens modal with empty form
- [ ] Form validates all required fields before submitting
- [ ] Successful create adds the new row to the table
- [ ] "Editar" opens modal pre-filled with row data
- [ ] Successful edit updates the row in the table
- [ ] "Desactivar" shows confirmation then calls the API
- [ ] Successful deactivate updates the status badge in the table
- [ ] API errors are shown as red Alerts (table load error + modal save error)
