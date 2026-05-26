import { Application } from "oak";
import { router } from "./router.ts";
import { waitForDb } from "./db.ts";
import { setupSockets } from "./binance.ts";

const client = await waitForDb();
client.release();
console.log("[Database] successfuly connected");

setupSockets();

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
await app.listen({ port: 8000 });