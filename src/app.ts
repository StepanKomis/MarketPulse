import { Application } from "oak";
import { router } from "./router/router.ts";

// Create and configure the main Oak application
// This is the core HTTP server instance
export const app = new Application();

// Register router middleware to handle API routes
app.use(router.routes());
// Add default HTTP method handling (405 Method Not Allowed, etc.)
app.use(router.allowedMethods());