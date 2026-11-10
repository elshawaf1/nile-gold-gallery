import { describe, expect, it } from "vitest";

import { priceBreakdown, priceOf } from "@/lib/pricing";
import type { Karat } from "@/lib/shop";

const rates: Record<Karat, number> = { "24K": 7068, "21K": 6184, "18K": 5301 };

describe("priceOf", () => {
  it("charges weight × (gram rate + making per gram)", () => {
    expect(priceOf({ weight: 45, karat: "21K", making: 350 }, rates)).toBe(294_030);
  });

  it("uses the rate for the product's own karat", () => {
    expect(priceOf({ weight: 10, karat: "24K", making: 0 }, rates)).toBe(70_680);
    expect(priceOf({ weight: 10, karat: "18K", making: 0 }, rates)).toBe(53_010);
  });

  it("rounds the final total once", () => {
    expect(priceOf({ weight: 2.5, karat: "21K", making: 125 }, rates)).toBe(15_773);
  });

  it("returns a consistent breakdown", () => {
    const breakdown = priceBreakdown({ weight: 12.4, karat: "21K", making: 200 }, rates);
    expect(breakdown).toEqual({
      rate: 6184,
      gold: 76_682,
      making: 2_480,
      total: 79_162,
    });
  });

  it("defaults to the stored fallback rates", () => {
    expect(priceOf({ weight: 1, karat: "21K", making: 0 })).toBe(5600);
  });
});
