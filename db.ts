import { Pool, PoolClient } from "postgres";

// Singleton connection pool - reused across the entire application
// Connection pool prevents exhausting database connections and improves performance
const pool = new Pool({
  hostname: Deno.env.get("DB_HOST") ?? "localhost",
  port: Number(Deno.env.get("DB_PORT") ?? 5432),
  database: Deno.env.get("DB_NAME") ?? "marketpulse",
  user: Deno.env.get("DB_USER") ?? "postgres",
  password: Deno.env.get("DB_PASSWD") ?? "",
}, Number(Deno.env.get("DB_POOL_MAX") ?? 10), true);

/**
 * Waits for the database to become available before continuing
 * Useful for ensuring DB is ready before starting the main application
 * 
 * @param retries - Number of connection attempts before failing
 * @param delayMs - Milliseconds to wait between retries
 * @returns A connected database client
 * @throws Error if database cannot be reached after all retries
 */
async function waitForDb(retries = 10, delayMs = 2000): Promise<PoolClient> {
  console.log("[Database] connecting to postgrese");
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      await client.queryArray("SELECT 1");
      return client;
    } catch (e) {
      console.warn(`DB not ready, retry ${i + 1}/${retries}...`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw new Error("Could not connect to database after retries");
}

/**
 * Returns a database client from the connection pool
 * Always call client.release() after using to return it to the pool
 * 
 * @returns A connected database client
 */
async function getDBClient(): Promise<PoolClient> {
  return await pool.connect();
}

export { waitForDb, getDBClient };