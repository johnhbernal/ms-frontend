# Project Claude Configuration

Extends global CLAUDE.md. Project-specific rules take precedence.

## Project Identity

- **name:** ms-frontend
- **stack:** React 18 + Vite 6, react-router-dom 7, react-bootstrap 5, axios, react-hook-form + yup
- **language:** es (UI copy); code/comments in English unless matching existing Spanish messages

## Architecture Notes

- SPA for Practica parameter management.
- Auth via ms-auth JWT; session key `token` in `sessionStorage`.
- Protected routes: `PrivateRoute` + `isTokenExpired`.
- Agent playbooks: `.ai/AGENTS.md`, `.ai/REACT.md`, `.ai/SECURITY.md`, `.ai/CI.md`.

## Conventions

- Pin React to 18 — do not bump to 19 without verifying Vite/React plugin support.
- Prefer editing existing files.
- Run tests with `CI=true npm test` and `npm run build` after substantive changes.
- Align docs with code (storage key `token`, React 18, Vite env prefix `VITE_*`).

## Out of Scope

- Inventing product features
- Committing secrets or `.env` credentials

## Active Stack Profiles

- react
- vite
- bootstrap
