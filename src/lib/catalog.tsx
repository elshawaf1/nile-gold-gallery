import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

import type { CatalogData, Category, PriceRange, ShopSettings } from "@/lib/catalog-types";
import { getCatalog } from "@/server/catalog";
import type { Product } from "@/lib/products";
import { SHOP } from "@/lib/shop";
import { STATIC_DEMO, STATIC_DEMO_CATALOG } from "@/lib/static-demo";

const FALLBACK_SETTINGS: ShopSettings = {
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
};

const FALLBACK: CatalogData = {
  products: [],
  categories: [],
  priceRanges: [],
  settings: FALLBACK_SETTINGS,
  rateOverride: { enabled: false, rates: { "24K": 6400, "21K": 5600, "18K": 4800 } },
};

type CatalogValue = CatalogData & { isLoading: boolean; refetch: () => void };

const CatalogContext = createContext<CatalogValue | null>(null);

export function CatalogProvider({
  children,
  initialCatalog,
}: {
  children: ReactNode;
  initialCatalog?: CatalogData;
}) {
  const query = useQuery({
    queryKey: ["catalog"],
    queryFn: () => (STATIC_DEMO ? Promise.resolve(STATIC_DEMO_CATALOG) : getCatalog()),
    initialData: initialCatalog,
    staleTime: 60 * 1000,
  });

  const value = useMemo<CatalogValue>(
    () => ({
      ...(query.data ?? FALLBACK),
      isLoading: query.isLoading,
      refetch: () => {
        void query.refetch();
      },
    }),
    [query.data, query.isLoading, query.refetch],
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used inside CatalogProvider");
  return ctx;
}

export function useShop(): ShopSettings {
  return useCatalog().settings;
}

export function useProducts(): Product[] {
  return useCatalog().products;
}

export function useCategories(): Category[] {
  return useCatalog().categories;
}

export function usePriceRanges(): PriceRange[] {
  return useCatalog().priceRanges;
}

export function labelForCategory(
  categories: readonly Category[],
  slug: string,
  lang: "ar" | "en",
): string {
  const match = categories.find((category) => category.slug === slug);
  if (!match) return slug;
  return lang === "ar" ? match.labelAr : match.labelEn;
}

export function labelForRange(range: PriceRange, lang: "ar" | "en"): string {
  return lang === "ar" ? range.labelAr : range.labelEn;
}
