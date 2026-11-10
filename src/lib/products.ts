import necklace from "@/assets/gold-necklace.jpg";
import rings from "@/assets/gold-rings.jpg";
import bangles from "@/assets/gold-bangles.jpg";
import earrings from "@/assets/gold-earrings.jpg";
import bars from "@/assets/gold-bars.jpg";
import pendant from "@/assets/gold-pendant.jpg";
import bridal from "@/assets/gold-bridal-set.jpg";
import chain from "@/assets/gold-chain.jpg";
import pound from "@/assets/gold-pound.jpg";
import signet from "@/assets/gold-signet.jpg";
import anklet from "@/assets/gold-anklet.jpg";

import { GOLD_RATES, type Karat } from "@/lib/shop";

export const CATEGORIES = [
  "Necklaces",
  "Rings",
  "Bracelets",
  "Earrings",
  "Anklets",
  "Bridal Sets",
  "Gold Coins",
  "Gold Bars",
] as const;
export type ProductCategory = (typeof CATEGORIES)[number];

export const KARATS: Karat[] = ["24K", "21K", "18K"];

export type Product = {
  id: string;
  title: string;
  titleAr: string;
  category: ProductCategory;
  karat: Karat;
  /** Weight in grams */
  weight: number;
  /** Workmanship charge per gram in EGP */
  making: number;
  rating: number;
  reviews: number;
  description: string;
  image: string;
};

export const PRODUCTS: Product[] = [
  { id: "nefertari-bridal-set", title: "Nefertari Bridal Set", titleAr: "طقم نفرتاري", category: "Bridal Sets", karat: "21K", weight: 45, making: 350, rating: 4.9, reviews: 128, description: "Necklace, earrings and bracelet in hand-worked floral filigree. Comes in a gift box.", image: bridal },
  { id: "lotus-filigree-necklace", title: "Lotus Filigree Necklace", titleAr: "عقد اللوتس", category: "Necklaces", karat: "21K", weight: 18.5, making: 300, rating: 4.8, reviews: 96, description: "Openwork filigree with a teardrop centrepiece and gold bead drops.", image: necklace },
  { id: "pharaonic-bangles", title: "Pharaonic Bangles (set of 5)", titleAr: "غوايش فرعوني", category: "Bracelets", karat: "21K", weight: 32, making: 250, rating: 4.7, reviews: 210, description: "Engraved bangles with the Eye of Horus, ankh and winged scarab.", image: bangles },
  { id: "gold-pound", title: "Gold Pound — Geneh Dahab", titleAr: "جنيه ذهب", category: "Gold Coins", karat: "21K", weight: 8, making: 100, rating: 4.9, reviews: 410, description: "The classic Egyptian gold pound, 8 grams of 21K. A favourite for saving and gifts.", image: pound },
  { id: "fine-gold-bar-10g", title: "Fine Gold Bar 10g", titleAr: "سبيكة ١٠ جرام", category: "Gold Bars", karat: "24K", weight: 10, making: 60, rating: 5, reviews: 88, description: "999.9 fine gold bar with certificate. Also available in 1g, 5g, 20g and 50g.", image: bars },
  { id: "cuban-link-chain", title: "Cuban Link Chain", titleAr: "سلسلة كوبي", category: "Necklaces", karat: "21K", weight: 25, making: 180, rating: 4.7, reviews: 73, description: "Solid Cuban links with a secure box clasp. 55 cm.", image: chain },
  { id: "arabic-name-necklace", title: "Arabic Name Necklace", titleAr: "سلسلة بالاسم", category: "Necklaces", karat: "18K", weight: 3.5, making: 400, rating: 4.9, reviews: 342, description: "Any name in Arabic calligraphy on a fine chain. Made to order in 3–5 days.", image: pendant },
  { id: "crescent-moon-earrings", title: "Crescent Moon Earrings", titleAr: "حلق الهلال", category: "Earrings", karat: "18K", weight: 7.2, making: 280, rating: 4.6, reviews: 64, description: "Crescent drops set with clear stones and a fluted gold bead.", image: earrings },
  { id: "everyday-ring-set", title: "Everyday Ring Set (3 pcs)", titleAr: "طقم خواتم", category: "Rings", karat: "18K", weight: 9, making: 220, rating: 4.5, reviews: 152, description: "Crossover, eternity and hammered bands — stack or wear alone.", image: rings },
  { id: "mens-signet-ring", title: "Men's Signet Ring", titleAr: "خاتم رجالي", category: "Rings", karat: "21K", weight: 12, making: 200, rating: 4.6, reviews: 57, description: "Polished cushion-top signet. Free engraving of initials.", image: signet },
  { id: "coin-charm-anklet", title: "Coin Charm Anklet", titleAr: "خلخال عملات", category: "Anklets", karat: "18K", weight: 4, making: 250, rating: 4.4, reviews: 39, description: "Fine chain with seven little coin charms and an adjustable extender.", image: anklet },
];

/** Price = weight × (today's gram rate for the karat + workmanship per gram). */
export function priceOf(p: Pick<Product, "weight" | "karat" | "making">) {
  return Math.round(p.weight * (GOLD_RATES[p.karat] + p.making));
}

export function getProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}
