# ── Stage 1: cache dependencies ──────────────────────────────────────────────
FROM denoland/deno:2.1.4 AS deps

WORKDIR /app
COPY deno.json ./
RUN deno install --entrypoint main.ts || true   # pre-warm module cache

# ── Stage 2: final image ─────────────────────────────────────────────────────
FROM denoland/deno:2.1.4

WORKDIR /app

# Copy source
COPY deno.json .
COPY *.ts ./

# Pre-compile (type-check + cache) — fails fast if code has TS errors
RUN deno cache main.ts

EXPOSE 8000

# Deno's official image already runs as the non-root "deno" user
USER deno

CMD ["deno", "run", "--allow-net", "--allow-env", "--allow-read", "main.ts"]