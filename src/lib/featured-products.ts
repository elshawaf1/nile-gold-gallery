import type { Product } from "@/lib/products";

const FEATURED_PRODUCT_LIMIT = 11;

export function shuffleProducts(products: Product[], seed: number): Product[] {
  const shuffled = [...products];
  let state = seed >>> 0;

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    const random = ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    const swapIndex = Math.floor(random * (index + 1));
    const current = shuffled[index]!;
    shuffled[index] = shuffled[swapIndex]!;
    shuffled[swapIndex] = current;
  }

  return shuffled;
}

export function featuredProducts(products: Product[], seed: number): Product[] {
  return shuffleProducts(products, seed).slice(0, FEATURED_PRODUCT_LIMIT);
}
