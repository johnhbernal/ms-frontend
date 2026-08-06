---
name: practica-council
description: >-
  Comité de expertos del stack Practica (AuthZ/RBAC, Spring, React/Vite, UX,
  Playwright, Docker). Usar al validar pruebas, demo AuthN/AuthZ, o cuando el
  usuario pida «el consejo» / agentes expertos. Aplica lecciones Kilele.
---

# Practica Council

Fan-out paralelo (no serial):

1. **Security/AuthZ** — `ms-auth/.ai/SECURITY.md` + `ACTIVE-DIRECTORY.md`
2. **Spring/QA** — `ms-auth/.ai/QA.md` + `RbacControllerIntegrationTest`
3. **React + Design** — `ms-frontend/.ai/REACT.md` + `DESIGN.md`
4. **Playwright/DevOps** — correr E2E `--workers=1` + `docker compose ps`

Orquestador: `practica-stack/.ai/AGENTS.md`

## Evidencia mínima

- Rebuild si JWT sin `permissions` o `/api/rbac` 404
- JUnit seller 403 + Playwright UI DENY + **API PUT 403**
- Scorecard por rol → síntesis APTO / APTO CONDICIONAL / NO APTO

## Prohibido (Kilele)

- PASS solo Vitest/JUnit
- “No hay Administración” sin probar `admin` + imagen fresca
- Claim LDAP real / AD corporativo
