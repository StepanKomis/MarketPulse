import { Pool, PoolClient } from "postgres";

// singleton — jeden pool, jednou
const pool = new Pool({
  hostname: Deno.env.get("DB_HOST") ?? "localhost",
  port: Number(Deno.env.get("DB_PORT") ?? 5432),
  database: Deno.env.get("DB_NAME") ?? "marketpulse",
  user: Deno.env.get("DB_USER") ?? "postgres",
  password: Deno.env.get("DB_PASSWD") ?? "",
}, Number(Deno.env.get("DB_POOL_MAX") ?? 10), true);

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

async function getDBClient(): Promise<PoolClient> {
  return await pool.connect();
}

export { waitForDb, getDBClient };