CREATE TABLE prices (
    id          BIGSERIAL PRIMARY KEY,
    exchange    TEXT        NOT NULL,
    symbol      TEXT        NOT NULL,
    price       NUMERIC(20, 8) NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_prices_symbol_time ON prices (symbol, recorded_at DESC);