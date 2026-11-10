import { GOLD_RATES, type Karat } from "@/lib/shop";

export type PricedProduct = {
  /** Weight in grams. */
  weight: number;
  karat: Karat;
  /** Workmanship charge per gram in EGP. */
  making: number;
};

export type PriceBreakdown = {
  /** The gram rate used for this karat, in EGP. */
  rate: number;
  /** Gold value (weight × gram rate), rounded. */
  gold: number;
  /** Workmanship value (weight × making per gram), rounded. */
  making: number;
  /** Final rounded total. Always equals `weight × (rate + making)`. */
  total: number;
};

export function priceBreakdown(
  product: PricedProduct,
  rates: Record<Karat, number> = GOLD_RATES,
): PriceBreakdown {
  const rate = rates[product.karat] ?? 0;
  const goldValue = product.weight * rate;
  const makingValue = product.weight * product.making;

  return {
    rate,
    gold: Math.round(goldValue),
    making: Math.round(makingValue),
    total: Math.round(goldValue + makingValue),
  };
}

export function priceOf(product: PricedProduct, rates: Record<Karat, number> = GOLD_RATES): number {
  return priceBreakdown(product, rates).total;
}
