import { app } from "./src/app.ts";
import { waitForDb } from "./src/database/db.ts";
import { setupSockets } from "./src/binance/binance.ts";

// Application startup sequence

// 1. Verify database connectivity before proceeding
// This ensures all subsequent database operations will work
const client = await waitForDb();
client.release(); // Immediately release - we just needed to test connection
console.log("[Database] successfully connected");

// 2. Initialize WebSocket connections for existing symbols
// This starts real-time price monitoring for symbols already in the database
setupSockets();

// 3. Start the HTTP server to handle API requests
// The server will listen on port 8000 (configurable via env)
console.log("[Server] MarketPulse listening on port " + Deno.env.get("PORT") || 8000);
await app.listen({ port: Number(Deno.env.get("PORT")) || 8000 });