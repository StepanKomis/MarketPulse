import { assertEquals } from "@std/assert";

Deno.test("symbol is lowercase", () => {
  const symbol = "BTC";
  assertEquals(symbol.toLowerCase(), "btc");
});