import type { Karat } from "@/lib/shop";

export const DALEELAK_FEED_URL = "https://getdaleelak.com/api/v1/feed.json?category=metals";

const ASSET_FOR_KARAT: Record<Karat, string> = {
  "24K": "GOLD24K-EGP",
  "21K": "GOLD21K-EGP",
  "18K": "GOLD18K-EGP",
};

type DaleelakAsset = {
  id?: unknown;
  directions?: {
    sell?: {
      best?: {
        value?: unknown;
        seller?: unknown;
      } | null;
    } | null;
  } | null;
  benchmark?: {
    sell?: unknown;
  } | null;
  global?: {
    value?: unknown;
  } | null;
};

type DaleelakFeed = {
  generatedAt?: unknown;
  assets?: unknown;
};

export type DaleelakRates = {
  rates: Record<Karat, number>;
  updatedAt: string;
  sellers: Partial<Record<Karat, string>>;
};

function positiveNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value;
  }

  if (typeof value === "string") {
    const trimmed = value.replace(/[,\s]/g, "").trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  return null;
}

/**
 * Extracts the local Egyptian customer price per gram for 24K/21K/18K.
 *
 * Daleelak defines `sell` as what a buyer pays at the licensed seller, so that
 * side is used first. `global` is the converted world price and is only a
 * fallback when the seller table is unavailable.
 */
export function parseDaleelakRates(feed: unknown): DaleelakRates | null {
  if (!feed || typeof feed !== "object") return null;
  const { assets, generatedAt } = feed as DaleelakFeed;
  if (!Array.isArray(assets)) return null;

  const rates = {} as Record<Karat, number>;
  const sellers: Partial<Record<Karat, string>> = {};

  for (const [karat, assetId] of Object.entries(ASSET_FOR_KARAT) as Array<[Karat, string]>) {
    const asset = assets.find(
      (candidate): candidate is DaleelakAsset =>
        !!candidate &&
        typeof candidate === "object" &&
        String((candidate as DaleelakAsset).id ?? "").toUpperCase() === assetId,
    );
    if (!asset) return null;

    const sell = asset.directions?.sell?.best;
    const value =
      positiveNumber(sell?.value) ??
      positiveNumber(asset.global?.value) ??
      positiveNumber(asset.benchmark?.sell);

    if (value === null) return null;
    rates[karat] = value;

    if (typeof sell?.seller === "string" && sell.seller.trim()) {
      sellers[karat] = sell.seller.trim();
    }
  }

  return {
    rates,
    updatedAt:
      typeof generatedAt === "string" && generatedAt ? generatedAt : new Date().toISOString(),
    sellers,
  };
}
