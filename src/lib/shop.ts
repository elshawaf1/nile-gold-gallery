// Placeholder shop details and sample gold rates — replace with the shop's real values.
export const SHOP = {
  name: "Dahab",
  nameAr: "دار الذهب",
  phone: "+20 100 000 0000",
  whatsapp: "201000000000",
  address: "Khan el-Khalili, El-Gamaleya, Cairo",
  hours: "Daily 11:00 – 22:00",
};

export type Karat = "24K" | "21K" | "18K";

/** Sample gold price per gram in EGP, by karat. */
export const GOLD_RATES: Record<Karat, number> = {
  "24K": 6400,
  "21K": 5600,
  "18K": 4800,
};

export function formatEGP(value: number) {
  return `EGP ${Math.round(value).toLocaleString("en-US")}`;
}

export function whatsappLink(text: string) {
  return `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(text)}`;
}
