CREATE TABLE symbols (
    id     BIGSERIAL PRIMARY KEY,
    symbol TEXT NOT NULL
);

CREATE TABLE prices (
    id          BIGSERIAL PRIMARY KEY,
    exchange    TEXT           NOT NULL,
    symbol      BIGINT         NOT NULL,
    price       NUMERIC(20, 8) NOT NULL,
    recorded_at TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    FOREIGN KEY (symbol) REFERENCES symbols(id)
);

CREATE INDEX idx_prices_symbol_time ON prices (symbol, recorded_at DESC);