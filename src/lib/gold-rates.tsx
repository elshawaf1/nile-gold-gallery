import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

import { getGoldRates, type GoldRatePayload } from "@/lib/gold-api";
import { GOLD_RATES, type Karat } from "@/lib/shop";

export type GoldRates = Record<Karat, number>;

type GoldRatesValue = {
  rates: GoldRates;
  live: boolean;
  updatedAt?: string | undefined;
  source?: string | undefined;
  isLoading: boolean;
  refetch: () => void;
};

const GoldRatesContext = createContext<GoldRatesValue | null>(null);

export function GoldRatesProvider({
  children,
  initialRates,
}: {
  children: ReactNode;
  initialRates?: GoldRatePayload;
}) {
  const query = useQuery({
    queryKey: ["gold-rates"],
    queryFn: () => getGoldRates(),
    initialData: initialRates,
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  const value = useMemo<GoldRatesValue>(
    () => ({
      rates: query.data?.rates ?? GOLD_RATES,
      live: query.data?.live ?? false,
      updatedAt: query.data?.updatedAt,
      source: query.data?.source,
      isLoading: query.isLoading,
      refetch: () => {
        void query.refetch();
      },
    }),
    [query.data, query.isLoading, query.refetch],
  );

  return <GoldRatesContext.Provider value={value}>{children}</GoldRatesContext.Provider>;
}

export function useGoldRates() {
  const ctx = useContext(GoldRatesContext);
  if (!ctx) throw new Error("useGoldRates must be used inside GoldRatesProvider");
  return ctx;
}
