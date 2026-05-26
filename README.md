# MarketPulse

MarketPulse is my way of trying the [Deno](https://github.com/denoland/deno)
project and get to know it better.

## What does the MarketPulse do?

Market pulse is a simple API and Postgrese combo. You make reques to
`POST /monitor?symbol=<symbol_you_want_to_monitor>` MarketPulse will save it to
database symbols and will start a stream from binance to get the prices over
time.

When MarketPulse have run for some time you can now make request like
`GET /prices?symbol=BTC&start=<timestamp>&end=<timestamp>` and it will return an
array of all the rocords, that the database has.

# Deployment

MarketPulse uses [docker](https://github.com/docker) so the deployment is
straight forwartd and can be done in a few commands. Just clone the repo, copy
the `.env.example` to `.env` and run `docker compose up -d --build`. Here is a
bash code block for you to copy:

```sh
git clone https://github.com/StepanKomis/MarketPulse.git
cd MarketPulse
cp .env.example .env
docker compose up -d --build
```

**If you plan to run MarketPulse real data collection you should update and
customice the .env values**