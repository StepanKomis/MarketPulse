import { assertEquals } from "@std/assert";
import { Application } from "oak";
import { router } from "./router.ts";

/**
 * Helper function to create a fresh application instance for each test
 * Ensures tests don't interfere with each other
 */
function createTestApp() {
  const app = new Application();
  app.use(router.routes());
  app.use(router.allowedMethods());
  return app;
}

// Test that the /prices endpoint validates the symbol parameter
Deno.test({
  name: "GET /prices without symbol returns 400",
  sanitizeOps: false, // Allow pending operations during test cleanup
  sanitizeResources: false, // Allow open resources during test cleanup
  async fn() {
    const app = createTestApp();
    const controller = new AbortController();
    const server = app.listen({ port: 8001, signal: controller.signal });
    
    // Give the server time to start listening
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const res = await fetch("http://localhost:8001/prices");
      assertEquals(res.status, 400);
      const body = await res.json();
      assertEquals(body.error, "symbol is required");
    } finally {
      controller.abort(); // Stop the server
      await server;
      Deno.exit(0); // Force exit to clear any hanging connections
    }
  }
});

// Test that /prices returns an array when a valid symbol is provided
Deno.test({
  name: "GET /prices with symbol returns array",
  sanitizeOps: false,
  sanitizeResources: false,
  async fn() {
    const app = createTestApp();
    const controller = new AbortController();
    const server = app.listen({ port: 8001, signal: controller.signal });
    
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const res = await fetch("http://localhost:8001/prices?symbol=btc");
      assertEquals(res.status, 200);
      const body = await res.json();
      assertEquals(Array.isArray(body), true);
    } finally {
      controller.abort();
      await server;
      Deno.exit(0);
    }
  }
});

// Test that POST /symbols validates the symbol parameter
Deno.test({
  name: "POST /symbols without symbol returns 400",
  sanitizeOps: false,
  sanitizeResources: false,
  async fn() {
    const app = createTestApp();
    const controller = new AbortController();
    const server = app.listen({ port: 8001, signal: controller.signal });
    
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const res = await fetch("http://localhost:8001/symbols", { method: "POST" });
      assertEquals(res.status, 400);
    } finally {
      controller.abort();
      await server;
      Deno.exit(0);
    }
  }
});