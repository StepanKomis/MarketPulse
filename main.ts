// main.ts - MarketPulse entry point

import {Application} from "oak";
import { router } from "./router.ts";

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods())

await app.listen({port: 8080})
