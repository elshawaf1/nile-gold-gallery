import { describe, expect, it } from "vitest";

import { addLine, buildOrderMessage, cartCount, cartSubtotal, setLineQty } from "@/lib/cart-logic";

describe("cart", () => {
  it("adding the same piece twice increases its quantity instead of duplicating it", () => {
    const lines = addLine(addLine([], "ring"), "ring");
    expect(lines).toEqual([{ id: "ring", qty: 2 }]);
  });

  it("setting quantity to 0 removes the piece", () => {
    expect(setLineQty([{ id: "ring", qty: 2 }], "ring", 0)).toEqual([]);
  });

  it("totals count and subtotal across pieces", () => {
    const lines = [
      { id: "a", qty: 2 },
      { id: "b", qty: 1 },
    ];
    const prices: Record<string, number> = { a: 1000, b: 2500 };
    expect(cartCount(lines)).toBe(3);
    expect(cartSubtotal(lines, (id) => prices[id])).toBe(4500);
  });

  it("WhatsApp order message lists each piece and the estimated total", () => {
    const msg = buildOrderMessage(
      "Dahab",
      [{ title: "Gold Pound", karat: "21K", weight: 8, qty: 2, price: 1000 }],
      (n) => `EGP ${n}`,
    );
    expect(msg).toContain("Gold Pound (21K, 8g) × 2 — EGP 2000");
    expect(msg).toContain("Estimated total: EGP 2000");
  });
});
