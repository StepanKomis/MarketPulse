# ── Stage 1: cache dependencies ──────────────────────────────────────────────
FROM denoland/deno:2.1.4 AS deps
WORKDIR /app
COPY deno.json ./
RUN deno install --entrypoint main.ts || true

# ── Stage 2: final image ─────────────────────────────────────────────────────
FROM denoland/deno:2.1.4
WORKDIR /app

ENV DENO_DIR=/app/.deno_cache

COPY deno.json .
COPY *.ts ./
COPY entrypoint.sh .

RUN mkdir -p /app/.deno_cache && \
    chmod +x entrypoint.sh && \
    chown -R deno:deno /app

USER deno

RUN deno cache main.ts
RUN deno cache --no-check *.test.ts

EXPOSE 8000
CMD ["./entrypoint.sh"]