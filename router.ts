import { Router } from "oak";
import { getDBClient } from "./db.ts";

const router = new Router();

router.get("/prices", async (context) => {
  const params = context.request.url.searchParams;
  const symbol = params.get("symbol")?.toLowerCase();
  const start = params.get("start");
  const end = params.get("end");

  if (!symbol) {
    context.response.status = 400;
    context.response.body = { error: "symbol is required" };
    return;
  }

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
    client.release();
  }
});

router.post("/symbols", async (context) => {
        const params = context.request.url.searchParams;
        let symbol = params.get("symbol") || "";
        symbol.toLowerCase
        if (symbol == "") {
            context.response.status = 501;
            context.response.body = "the symbol parameter needs to be filled out"
            return
        }
        const client = await getDBClient();
        client.queryArray("INSERT INTO symbols (symbol) VALUES ($1)", [symbol]);
        console.log("Added symbol " + symbol);
        context.response.status = 200;
    })


export { router };