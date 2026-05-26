import { Router } from "oak";
import { getDBClient } from "./db.ts";
import { connectSymbol } from "./binance.ts";

const router = new Router();

/**
 * GET /prices - Retrieve historical price data for a symbol
 * 
 * Query parameters:
 * - symbol (required): The trading symbol to query (e.g., 'btc', 'eth')
 * - start (optional): Unix timestamp for the start of the time range
 * - end (optional): Unix timestamp for the end of the time range
 * 
 * Returns: Array of price records with exchange, symbol, price, and recorded_at
 */
router.get("/prices", async (context) => {
  const params = context.request.url.searchParams;
  const symbol = params.get("symbol")?.toLowerCase();
  const start = params.get("start");
  const end = params.get("end");

  // Validate required symbol parameter
  if (!symbol) {
    context.response.status = 400;
    context.response.body = { error: "symbol is required" };
    return;
  }

  // Build dynamic WHERE clause based on provided filters
  const conditions = [`s.symbol || 'usdt' LIKE $1`];
  const args: unknown[] = [`%${symbol}%`];

  if (start) {
    args.push(new Date(Number(start)));
    conditions.push(`p.recorded_at >= $${args.length}`);
  }

  if (end) {
    args.push(new Date(Number(end)));
    conditions.push(`p.recorded_at <= $${args.length}`);
  }

  const client = await getDBClient();
  try {
    const result = await client.queryObject(
      `SELECT p.id::text, p.exchange, s.symbol, p.price::text, p.recorded_at
       FROM prices p
       JOIN symbols s ON s.id = p.symbol
       WHERE ${conditions.join(" AND ")}
       ORDER BY p.recorded_at DESC`,
      args,
    );
    context.response.body = result.rows;
  } finally {
    client.release(); // Always return client to pool
  }
});

/**
 * POST /symbols - Add a new symbol to monitor
 * 
 * Query parameter:
 * - symbol (required): The trading symbol to start monitoring (e.g., 'btc', 'eth')
 * 
 * Returns: Confirmation message with the added symbol
 * Note: Immediately begins streaming price data from Binance
 */
router.post("/symbols", async (context) => {
  const params = context.request.url.searchParams;
  let symbol = params.get("symbol")?.toLowerCase() || "";

  if (symbol === "") {
    context.response.status = 400;
    context.response.body = { error: "symbol parameter is required" };
    return;
  }

  const client = await getDBClient();
  try {
    // Insert symbol into database
    await client.queryArray("INSERT INTO symbols (symbol) VALUES ($1)", [symbol]);
    // Start WebSocket connection for the new symbol
    connectSymbol(symbol);
    console.log("Added symbol " + symbol);
    context.response.status = 200;
    context.response.body = { message: `Now monitoring ${symbol}` };
  } finally {
    client.release();
  }
});

export { router };