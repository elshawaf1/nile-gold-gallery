import type { Product } from "@/lib/products";

/** Extra English/Arabic words shoppers use for each category. */
export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Necklaces: ["necklace", "chain", "pendant", "سلسلة", "سلسله", "عقد", "كوليه"],
  Rings: ["ring", "band", "signet", "خاتم", "خواتم", "دبلة", "دبله"],
  Bracelets: ["bracelet", "bangle", "غويشة", "غوايش", "اسورة", "انسيال"],
  Earrings: ["earring", "حلق", "اقراط"],
  Anklets: ["anklet", "خلخال"],
  "Bridal Sets": ["bridal", "wedding", "set", "شبكة", "شبكه", "طقم"],
  "Gold Coins": ["coin", "pound", "geneh", "guinea", "جنيه", "جنيهات"],
  "Gold Bars": ["bar", "bullion", "ingot", "سبيكة", "سبيكه", "سبائك"],
};

export function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0640]/g, "") // Arabic diacritics + tatweel
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/عيار\s*/g, "")
    .trim();
}

function tokens(query: string) {
  return normalize(query)
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => t.replace(/^(\d{2})k?$/, "$1k")); // "21" -> "21k"
}

/** Returns products matching every word of the query, best matches first. */
export function searchProducts(products: Product[], query: string): Product[] {
  const words = tokens(query);
  if (words.length === 0) return products;

  const scored: { p: Product; score: number }[] = [];
  for (const p of products) {
    const title = normalize(p.title);
    const titleAr = normalize(p.titleAr);
    const category = normalize(p.category);
    const keywords = (CATEGORY_KEYWORDS[p.category] ?? []).map(normalize).join(" ");
    const karat = p.karat.toLowerCase();
    const desc = normalize(p.description);

    let score = 0;
    let all = true;
    for (const w of words) {
      let s = 0;
      if (karat === w) s = 4;
      else if (title.startsWith(w)) s = 6;
      else if (title.includes(w) || titleAr.includes(w)) s = 4;
      else if (category.includes(w) || keywords.includes(w)) s = 3;
      else if (desc.includes(w)) s = 1;
      if (s === 0) {
        all = false;
        break;
      }
      score += s;
    }
    if (all) scored.push({ p, score });
  }
  return scored.sort((a, b) => b.score - a.score).map((x) => x.p);
}

export function matchingCategories(categories: readonly string[], query: string) {
  const words = tokens(query);
  if (words.length === 0) return [];
  return categories.filter((c) => {
    const hay = [normalize(c), ...(CATEGORY_KEYWORDS[c] ?? []).map(normalize)].join(" ");
    return words.some((w) => hay.includes(w));
  });
}

export const PRICE_RANGES = {
  "under-25k": { label: "Under EGP 25,000", labelAr: "أقل من ٢٥٬٠٠٠ ج.م", min: 0, max: 25_000 },
  "25k-75k": {
    label: "EGP 25,000 – 75,000",
    labelAr: "٢٥٬٠٠٠ – ٧٥٬٠٠٠ ج.م",
    min: 25_000,
    max: 75_000,
  },
  "75k-150k": {
    label: "EGP 75,000 – 150,000",
    labelAr: "٧٥٬٠٠٠ – ١٥٠٬٠٠٠ ج.م",
    min: 75_000,
    max: 150_000,
  },
  "over-150k": {
    label: "Over EGP 150,000",
    labelAr: "أكثر من ١٥٠٬٠٠٠ ج.م",
    min: 150_000,
    max: Infinity,
  },
} as const;
export type PriceRangeKey = keyof typeof PRICE_RANGES;

export function priceRangeLabel(key: PriceRangeKey, lang: "ar" | "en") {
  return lang === "ar" ? PRICE_RANGES[key].labelAr : PRICE_RANGES[key].label;
}
