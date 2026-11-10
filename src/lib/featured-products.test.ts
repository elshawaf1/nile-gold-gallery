import { describe, expect, it } from "vitest";

import type { Product } from "@/lib/products";
import { featuredProducts, shuffleProducts } from "@/lib/featured-products";

const products = Array.from({ length: 14 }, (_, index) => ({
  id: `product-${index}`,
})) as Product[];

describe("featured products", () => {
  it("randomizes products deterministically for a given seed", () => {
    expect(shuffleProducts(products, 42).map((product) => product.id)).toEqual(
      shuffleProducts(products, 42).map((product) => product.id),
    );
    expect(shuffleProducts(products, 42).map((product) => product.id)).not.toEqual(
      products.map((product) => product.id),
    );
  });

  it("shows at most eleven unique products", () => {
    const featured = featuredProducts(products, 42);
    expect(featured).toHaveLength(11);
    expect(new Set(featured.map((product) => product.id)).size).toBe(11);
  });

  it("keeps all products when fewer than eleven are available", () => {
    expect(featuredProducts(products.slice(0, 4), 42)).toHaveLength(4);
  });
});
