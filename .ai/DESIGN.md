# DESIGN — ms-frontend (portafolio)

> Institucional, denso en datos, sin ornamento. Inspirado en el rigor visual de Kilele (“Registro Civil”), **sin** copiar marca Kilele.

## Principios

1. **Una composición** por pantalla — no dashboard de cards vacías.
2. **AuthZ visible** — badges OK/DENY en Inventario; no solo botones grises sin explicación.
3. **Discoverability** — Administración solo si JWT admin/`GROUP_ADMIN`/`USER_ADMIN`; hint demo en login.
4. **i18n parity** — toda string UI en `es-CO.json` **y** `en.json` antes de ship.
5. **Empty chrome = bug** — tabs Admin no deben renderizar formularios vacíos sin datos seed (o empty state explícito).

## Paleta / tokens

Usar CSS vars existentes (`--slate-*`, `--blue-600`). Evitar purple-glow genérico AI y dark-mode forzado en login.

## Gates visuales

- Playwright `rbac-module-authz.spec.js` `--workers=1` con stack sano.
- Screenshot Admin → Permisos (módulo + create) + Seller → DENY badges.

## Anti-patrones

- Nav “Administración” visible para seller.
- Claim visual de permisos sin tabla/código seed.
- Copy solo en un idioma.
