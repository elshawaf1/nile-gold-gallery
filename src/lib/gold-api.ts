import { createServerFn } from "@tanstack/react-start";

import { DALEELAK_FEED_URL, parseDaleelakRates } from "@/lib/daleelak";
import { GOLD_BULLION_URL, parseGoldBullionRates } from "@/lib/gold-bullion";
import { GOLD_RATES, type Karat } from "@/lib/shop";

export type GoldRatePayload = {
  rates: Record<Karat, number>;
  live: boolean;
  updatedAt: string;
  source: string;
  sellers?: Partial<Record<Karat, string>>;
  usdPerOunce?: number;
  usdToEgp?: number;
};

const TROY_OUNCE_GRAMS = 31.1034768;
const CACHE_MS = 60 * 1000;
const GOLD_URL = "https://api.gold-api.com/price/XAU";
const FX_URL = "https://open.er-api.com/v6/latest/USD";

let cache: { at: number; data: GoldRatePayload } | null = null;

function numericValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.replace(/[,\s]/g, "").trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(9000),
  });
  if (!response.ok) throw new Error(`Upstream responded ${response.status}`);
  return (await response.json()) as T;
}

async function fetchDaleelak(): Promise<GoldRatePayload> {
  const feed = await fetchJson<unknown>(DALEELAK_FEED_URL);
  const parsed = parseDaleelakRates(feed);
  if (!parsed) throw new Error("Daleelak feed missing gold assets");
  return {
    rates: parsed.rates,
    live: true,
    updatedAt: parsed.updatedAt,
    source: "daleelak.com",
    sellers: parsed.sellers,
  };
}

async function fetchGoldBullion(): Promise<GoldRatePayload> {
  const response = await fetch(GOLD_BULLION_URL, {
    headers: { accept: "text/html" },
    signal: AbortSignal.timeout(9000),
  });
  if (!response.ok) throw new Error(`Gold Bullion responded ${response.status}`);
  const parsed = parseGoldBullionRates(await response.text());
  if (!parsed) throw new Error("Gold Bullion page did not contain all buy rates");
  return {
    rates: parsed.rates,
    live: true,
    updatedAt: parsed.updatedAt,
    source: "goldbullioneg.com",
  };
}

async function fetchGlobalSpot(): Promise<GoldRatePayload> {
  const [gold, fx] = await Promise.all([
    fetchJson<{ price: number; updatedAt?: string }>(GOLD_URL),
    fetchJson<{ rates?: Record<string, number> }>(FX_URL),
  ]);

  const goldPrice = numericValue(gold.price);
  const usdToEgp = numericValue(fx.rates?.["EGP"]);
  if (goldPrice === null || usdToEgp === null) throw new Error("Incomplete price payload");

  const gram24 = (goldPrice / TROY_OUNCE_GRAMS) * usdToEgp;
  return {
    rates: {
      "24K": Math.round(gram24),
      "21K": Math.round((gram24 * 21) / 24),
      "18K": Math.round((gram24 * 18) / 24),
    },
    live: true,
    updatedAt: gold.updatedAt ?? new Date().toISOString(),
    source: "gold-api.com",
    usdPerOunce: Math.round(goldPrice),
    usdToEgp: Math.round(usdToEgp * 100) / 100,
  };
}

/**
 * Gold price per gram in EGP for 18K/21K/24K.
 *
 * Priority: admin manual override → Gold Bullion Egypt buy rates → Daleelak →
 * global spot × USD/EGP → stored fallback rates.
 */
export const getGoldRates = createServerFn({ method: "GET" }).handler(
  async (): Promise<GoldRatePayload> => {
    try {
      const { readRateOverride } = await import("@/server/catalog.server");
      const override = readRateOverride();
      if (override.enabled) {
        return {
          rates: override.rates,
          live: false,
          updatedAt: new Date().toISOString(),
          source: "manual",
        };
      }
    } catch {
      /* fall through to the live feeds */
    }

    if (cache && Date.now() - cache.at < CACHE_MS) return cache.data;

    try {
      const data = await fetchGoldBullion();
      cache = { at: Date.now(), data };
      return data;
    } catch (error) {
      console.error("[gold-rates] Gold Bullion unavailable, trying Daleelak:", error);
    }

    try {
      const data = await fetchDaleelak();
      cache = { at: Date.now(), data };
      return data;
    } catch (error) {
      console.error("[gold-rates] Daleelak unavailable, trying global spot:", error);
    }

    try {
      const data = await fetchGlobalSpot();
      cache = { at: Date.now(), data };
      return data;
    } catch (error) {
      console.error("[gold-rates] Falling back to stored rates:", error);
      return {
        rates: GOLD_RATES,
        live: false,
        updatedAt: new Date().toISOString(),
        source: "fallback",
      };
    }
  },
);
