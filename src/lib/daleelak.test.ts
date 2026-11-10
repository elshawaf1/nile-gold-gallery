import { describe, expect, it } from "vitest";

import { parseDaleelakRates } from "@/lib/daleelak";

const feed = {
  generatedAt: "2026-11-10T13:00:49.830Z",
  assets: [
    {
      id: "GOLD24K-EGP",
      directions: { sell: { best: { value: 7068.43, seller: "Gold Net Trading" } } },
      global: { value: 7093.19 },
    },
    {
      id: "GOLD21K-EGP",
      directions: { sell: { best: { value: 6184, seller: "eDahab" } } },
      global: { value: 6206.54 },
    },
    {
      id: "GOLD18K-EGP",
      directions: { sell: { best: { value: 5301, seller: "eDahab" } } },
      global: { value: 5319.89 },
    },
    { id: "GOLDPOUND-EGP", directions: { sell: { best: { value: 49416 } } } },
  ],
};

describe("parseDaleelakRates", () => {
  it("uses the licensed-seller sell price for each karat", () => {
    const parsed = parseDaleelakRates(feed);
    expect(parsed?.rates).toEqual({ "24K": 7068.43, "21K": 6184, "18K": 5301 });
    expect(parsed?.updatedAt).toBe("2026-11-10T13:00:49.830Z");
    expect(parsed?.sellers["21K"]).toBe("eDahab");
  });

  it("falls back to the global converted price when a seller is missing", () => {
    const withoutSeller = {
      ...feed,
      assets: feed.assets.map((asset) =>
        asset.id === "GOLD18K-EGP"
          ? { id: "GOLD18K-EGP", directions: {}, global: { value: 5319.89 } }
          : asset,
      ),
    };
    expect(parseDaleelakRates(withoutSeller)?.rates["18K"]).toBe(5319.89);
  });

  it("accepts numeric strings from live feeds", () => {
    const stringFeed = {
      generatedAt: "2026-11-10T13:00:49.830Z",
      assets: [
        {
          id: "GOLD24K-EGP",
          directions: { sell: { best: { value: "7068.43", seller: "Gold Net Trading" } } },
        },
        {
          id: "GOLD21K-EGP",
          directions: { sell: { best: { value: "6184", seller: "eDahab" } } },
        },
        {
          id: "GOLD18K-EGP",
          directions: { sell: { best: { value: "5,301.00", seller: "eDahab" } } },
        },
      ],
    };

    expect(parseDaleelakRates(stringFeed)?.rates).toEqual({
      "24K": 7068.43,
      "21K": 6184,
      "18K": 5301,
    });
  });

  it("returns null when one of the three gold assets is missing", () => {
    const missing = { assets: feed.assets.filter((asset) => asset.id !== "GOLD21K-EGP") };
    expect(parseDaleelakRates(missing)).toBeNull();
  });

  it("rejects malformed payloads", () => {
    expect(parseDaleelakRates(null)).toBeNull();
    expect(parseDaleelakRates({ assets: "nope" })).toBeNull();
  });
});
