# Project Claude Configuration

Extends global CLAUDE.md. Project-specific rules take precedence.

## Project Identity

- **name:** ms-frontend
- **stack:** React 18 + Create React App 5, react-router-dom 7, react-bootstrap 5, axios, react-hook-form + yup
- **language:** es (UI copy); code/comments in English unless matching existing Spanish messages

## Architecture Notes

- SPA for Practica parameter management.
- Auth via ms-auth JWT; session key `token` in `sessionStorage`.
- Protected routes: `PrivateRoute` + `isTokenExpired`.
- Agent playbooks: `.ai/AGENTS.md`, `.ai/REACT.md`, `.ai/SECURITY.md`, `.ai/CI.md`.

## Conventions

- Pin React to 18 for CRA 5 — do not bump to 19 without leaving CRA.
- Prefer editing existing files; no Vite migration unless requested.
- Run tests with `CI=true` and `npm run build` after substantive changes.
- Align docs with code (storage key `token`, React 18).

## Out of Scope

- Vite / Next migration in drive-by work
- Inventing product features
- Committing secrets or `.env` credentials

## Active Stack Profiles

- react
- create-react-app
- bootstrap
