import { assertEquals } from "@std/assert";
import { getDBClient } from "./database/db.ts";

Deno.test({
  name: "database connection works",
  sanitizeOps: false,
  sanitizeResources: false,
  async fn() {
    const client = await getDBClient();
    try {
      const result = await client.queryArray("SELECT 1");
      assertEquals(result.rows, [[1]]);
    } finally {
      client.release();
    }
  }
});

Deno.test({
  name: "symbols table exists",
  sanitizeOps: false,
  sanitizeResources: false,
  async fn() {
    const client = await getDBClient();
    try {
      const result = await client.queryArray("SELECT COUNT(*) FROM symbols");
      assertEquals(result.rows.length, 1);
    } finally {
      client.release();
    }
  }
});