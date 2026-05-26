-- Table to store trading symbols being monitored
-- Each symbol represents a cryptocurrency pair (e.g., 'btc', 'eth')
CREATE TABLE symbols (
    id     BIGSERIAL PRIMARY KEY,
    symbol TEXT NOT NULL          -- Symbol name in lowercase (e.g., 'btc', 'eth')
);

-- Table to store price data points from exchanges
-- This table grows over time as price updates are received from WebSocket streams
CREATE TABLE prices (
    id          BIGSERIAL PRIMARY KEY,
    exchange    TEXT           NOT NULL,     -- Source exchange (e.g., 'binance')
    symbol      BIGINT         NOT NULL,     -- Foreign key reference to symbols table
    price       NUMERIC(20, 8) NOT NULL,     -- Price with high precision for crypto
    recorded_at TIMESTAMPTZ    NOT NULL DEFAULT NOW(), -- Timestamp with timezone
    FOREIGN KEY (symbol) REFERENCES symbols(id)
);

-- Index to optimize time-series queries for a specific symbol
-- Used by GET /prices endpoint when filtering by symbol and time range
CREATE INDEX idx_prices_symbol_time ON prices (symbol, recorded_at DESC);