# MarketPulse

---

MarketPulse is my way of trying the [Deno](https://github.com/denoland/deno)
project and get to know it better.

# What does the MarketPulse do?

Market pulse is a simple API and Postgrese combo. You make reques to
`POST /monitor?symbol=<symbol_you_want_to_monitor>` MarketPulse will save it to
database symbols and will start a stream from binance to get the prices over
time.

When MarketPulse have run for some time you can now make request like
`GET /prices?symbol=BTC&start=<timestamp>&end=<timestamp>` and it will return an
array of all the rocords, that the database has.