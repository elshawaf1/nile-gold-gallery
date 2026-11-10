import type { Karat } from "@/lib/shop";

export type Category = {
  slug: string;
  labelEn: string;
  labelAr: string;
  sortOrder: number;
  active: boolean;
};

export type PriceRange = {
  key: string;
  labelEn: string;
  labelAr: string;
  min: number;
  /** Infinity for an open-ended "and above" bucket. */
  max: number;
};

export type ShopSettings = {
  name: string;
  nameAr: string;
  tagline: string;
  taglineAr: string;
  phone: string;
  whatsapp: string;
  address: string;
  addressAr: string;
  hours: string;
  hoursAr: string;
};

export type RateOverride = {
  enabled: boolean;
  rates: Record<Karat, number>;
};

export type CatalogData = {
  products: import("@/lib/products").Product[];
  categories: Category[];
  priceRanges: PriceRange[];
  settings: ShopSettings;
  rateOverride: RateOverride;
};
