import { getDBClient } from "./db.ts";

async function setupSockets() {
  console.log("[Sockets] setupSockets called");  // volá se vůbec?
  const client = await getDBClient();
  const result = await client.queryArray<[string]>("SELECT symbol FROM symbols");
  client.release();
  console.log("[Sockets] symbols:", result.rows);  // co je v DB?

  if (result.rows.length === 0) {
    console.log("No symbols available, waiting for new ones...");
    return;
  }

  for (const [symbol] of result.rows) {
    connectSymbol(symbol);
  }
}

function connectSymbol(symbol: string) {
  const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}usdt@miniTicker`);

  ws.onmessage = async (e) => {
    const data = JSON.parse(e.data);
    console.log(`[${symbol}] price: ${data.c}`);  // přicházejí data?
    const client = await getDBClient();
    try {
      await client.queryArray(
        `INSERT INTO prices (exchange, symbol, price)
         VALUES ($1, (SELECT id FROM symbols WHERE symbol || 'usdt' = $2), $3)`,
        ["binance", data.s.toLowerCase(), data.c],
      );
      console.log(`[${symbol}] saved`);  // ukládá se?
    } catch (e) {
      console.error(`[${symbol}] insert error:`, e);  // co se děje?
    } finally {
      client.release();
    }
  };

  ws.onclose = () => {
    console.warn(`[${symbol}] disconnected, reconnecting in 3s...`);
    setTimeout(() => connectSymbol(symbol), 3000);
  };

  ws.onerror = (e) => console.error(`[${symbol}] error:`, e);

  console.log(`[${symbol}] connected`);
}

export { setupSockets };