import { getDBClient } from "../../db.ts";

/**
 * Sets up WebSocket connections for all symbols stored in the database
 * Called once when the server starts to begin monitoring existing symbols
 */
async function setupSockets() {
  console.log("[Sockets] setupSockets called");
  const client = await getDBClient();
  const result = await client.queryArray<[string]>("SELECT symbol FROM symbols");
  client.release();
  console.log("[Sockets] symbols:", result.rows);

  // If no symbols exist yet, wait for them to be added via POST /symbols
  if (result.rows.length === 0) {
    console.log("No symbols available, waiting for new ones...");
    return;
  }

  // Establish WebSocket connection for each symbol
  for (const [symbol] of result.rows) {
    connectSymbol(symbol);
  }
}

/**
 * Establishes a WebSocket connection to Binance for a specific symbol
 * Listens for miniTicker updates and stores price data in the database
 * Implements auto-reconnection on disconnect
 * 
 * @param symbol - The trading symbol to monitor (e.g., 'btc', 'eth')
 */
function connectSymbol(symbol: string) {
  // Connect to Binance WebSocket stream for the symbol's USDT pair
  const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}usdt@miniTicker`);

  // Handle incoming price updates
  ws.onmessage = async (e) => {
    const data = JSON.parse(e.data);
    console.log(`[${symbol}] price: ${data.c}`);
    const client = await getDBClient();
    try {
      // Insert price record into database
      await client.queryArray(
        `INSERT INTO prices (exchange, symbol, price)
         VALUES ($1, (SELECT id FROM symbols WHERE symbol || 'usdt' = $2), $3)`,
        ["binance", data.s.toLowerCase(), data.c],
      );
      console.log(`[${symbol}] saved`);
    } catch (e) {
      console.error(`[${symbol}] insert error:`, e);
    } finally {
      client.release();
    }
  };

  // Handle disconnection with automatic reconnection after 3 seconds
  ws.onclose = () => {
    console.warn(`[${symbol}] disconnected, reconnecting in 3s...`);
    setTimeout(() => connectSymbol(symbol), 3000);
  };

  ws.onerror = (e) => console.error(`[${symbol}] error:`, e);

  console.log(`[${symbol}] connected`);
}

export { setupSockets, connectSymbol };