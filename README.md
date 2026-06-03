# MarketPulse

MarketPulse is my way of trying out the [Deno](https://github.com/denoland/deno)
project and getting to know it better.

## What does MarketPulse do?

MarketPulse is a simple API and Postgres combo. You make a request to
`POST /monitor?symbol=<symbol_you_want_to_monitor>` and MarketPulse will save it
to the database symbols and start a stream from Binance to get the prices over
time.

When MarketPulse has been running for some time, you can make a request like
`GET /prices?symbol=BTC&start=<timestamp>&end=<timestamp>` and it will return an
array of all the records that the database has.

# Deployment

MarketPulse uses [Docker](https://github.com/docker), so the deployment is
straightforward and can be done in a few commands. Just clone the repo, copy the
`.env.example` to `.env`, and run `docker compose up -d --build`. Here is a bash
code block for you to copy:

```sh
git clone https://github.com/StepanKomis/MarketPulse.git
cd MarketPulse
cp .env.example .env
docker compose up -d --build
```

# Why I built this?

I was preparing for a job application at a trading startup that uses Deno and PostgreSQL.
Instead of just reading the docs, I built something relevant — a real-time price collector
that streams live data from Binance, stores it in PostgreSQL, and exposes a REST API to
query historical prices by symbol and time range.

It's a weekend project, but it has tests, Docker deployment, and a proper schema.