export const SHOP = {
  name: "Al-Safa Al-Marwa",
  nameAr: "الصفا المروة",
  tagline: "Fine gold jewelry in Dekernes, Dakahlia",
  taglineAr: "مجوهرات ذهب فاخرة في دكرنس، الدقهلية",
  phone: "+20 100 000 0000",
  whatsapp: "201000000000",
  address: "Dekernes, Dakahlia, Egypt",
  addressAr: "دكرنس، الدقهلية، مصر",
  hours: "Daily 11:00 – 22:00",
  hoursAr: "يوميًا ١١:٠٠ – ٢٢:٠٠",
};

export type Karat = "24K" | "21K" | "18K";

/**
 * Fallback gold price per gram in EGP, by karat.
 * Live rates are fetched by `getGoldRates` and take priority; these values are
 * only used when the upstream price service cannot be reached.
 */
export const GOLD_RATES: Record<Karat, number> = {
  "24K": 6400,
  "21K": 5600,
  "18K": 4800,
};

export function formatEGP(value: number, lang: "ar" | "en" = "en") {
  const amount = Math.round(value).toLocaleString("en-US");
  return lang === "ar" ? `${amount} ج.م` : `EGP ${amount}`;
}

export function whatsappLink(text: string, number: string = SHOP.whatsapp) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
