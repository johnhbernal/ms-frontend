# ── Build stage ───────────────────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY public ./public
COPY src ./src

# CRA bakes env at build time — must be browser-reachable URLs (usually host localhost, not Docker service names).
ARG REACT_APP_AUTH_API_URL=http://localhost:8081
ARG REACT_APP_PRACTICA_API_URL=http://localhost:8082/api
ENV REACT_APP_AUTH_API_URL=$REACT_APP_AUTH_API_URL \
    REACT_APP_PRACTICA_API_URL=$REACT_APP_PRACTICA_API_URL \
    CI=true

RUN npm run build

# ── Runtime stage (non-root nginx) ────────────────────────────────────────────
FROM nginxinc/nginx-unprivileged:1.27-alpine

USER 0
RUN apk add --no-cache curl
USER 101

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -fsS http://127.0.0.1:8080/health || exit 1
