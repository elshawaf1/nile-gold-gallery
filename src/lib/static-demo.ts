import { PRICE_RANGES } from "@/lib/search";
import { CATEGORY_LABELS, CATEGORIES, getProduct, PRODUCTS } from "@/lib/products";
import type { CatalogData } from "@/lib/catalog-types";
import type { GoldRatePayload } from "@/lib/gold-api";
import { GOLD_RATES, SHOP } from "@/lib/shop";

import ratesSnapshot from "./static-demo-rates.json";

export const STATIC_DEMO = import.meta.env["VITE_STATIC_DEMO"] === "true";

export const STATIC_DEMO_CATALOG: CatalogData = {
  products: PRODUCTS,
  categories: CATEGORIES.map((slug, sortOrder) => {
    const labels = CATEGORY_LABELS[slug] ?? { en: slug, ar: slug };
    return {
      slug,
      labelEn: labels.en,
      labelAr: labels.ar,
      sortOrder,
      active: true,
    };
  }),
  priceRanges: Object.entries(PRICE_RANGES).map(([key, range], sortOrder) => ({
    key,
    labelEn: range.label,
    labelAr: range.labelAr,
    min: range.min,
    max: range.max,
    sortOrder,
  })),
  settings: {
    name: SHOP.name,
    nameAr: SHOP.nameAr,
    tagline: SHOP.tagline,
    taglineAr: SHOP.taglineAr,
    phone: SHOP.phone,
    whatsapp: SHOP.whatsapp,
    address: SHOP.address,
    addressAr: SHOP.addressAr,
    hours: SHOP.hours,
    hoursAr: SHOP.hoursAr,
  },
  rateOverride: { enabled: false, rates: GOLD_RATES },
};

export const STATIC_DEMO_RATES: GoldRatePayload = {
  rates: ratesSnapshot.rates,
  live: false,
  updatedAt: ratesSnapshot.updatedAt,
  source: "static-demo",
};

export { getProduct };
