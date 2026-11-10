import { describe, expect, it } from "vitest";

import { PRODUCTS } from "@/lib/products";
import { matchingCategories, searchProducts } from "@/lib/search";

const ids = (q: string) => searchProducts(PRODUCTS, q).map((p) => p.id);

describe("search", () => {
  it("finds the gold pound by the English word 'pound'", () => {
    expect(ids("pound")).toContain("gold-pound");
  });

  it("finds rings when searching in Arabic (خاتم)", () => {
    const found = searchProducts(PRODUCTS, "خاتم");
    expect(found.length).toBeGreaterThan(0);
    expect(found.every((p) => p.category === "Rings")).toBe(true);
  });

  it("finds gold bars by the Arabic word سبيكة", () => {
    expect(ids("سبيكة")).toContain("fine-gold-bar-10g");
  });

  it("requires every word to match: '18 necklace' returns only 18K necklaces", () => {
    const found = searchProducts(PRODUCTS, "18 necklace");
    expect(found.length).toBeGreaterThan(0);
    expect(found.every((p) => p.karat === "18K" && p.category === "Necklaces")).toBe(true);
  });

  it("suggests the Bracelets category for 'bangle'", () => {
    expect(matchingCategories(["Rings", "Bracelets"], "bangle")).toEqual(["Bracelets"]);
  });
});
