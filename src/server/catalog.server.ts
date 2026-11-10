import type {
  CatalogData,
  Category,
  PriceRange,
  RateOverride,
  ShopSettings,
} from "@/lib/catalog-types";
import type { Product } from "@/lib/products";
import type { Karat } from "@/lib/shop";
import { getDb } from "./db";

type ProductRow = {
  id: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  category: string;
  karat: string;
  weight: number;
  making: number;
  rating: number;
  reviews: number;
  image_url: string;
  in_stock: number;
  active: number;
  sort_order: number;
};

export type CategoryRow = {
  slug: string;
  label_en: string;
  label_ar: string;
  sort_order: number;
  active: number;
};

type RangeRow = {
  key: string;
  label_en: string;
  label_ar: string;
  min_value: number;
  max_value: number | null;
  sort_order: number;
};

export function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    title: row.title_en,
    titleAr: row.title_ar,
    description: row.description_en,
    descriptionAr: row.description_ar,
    category: row.category,
    karat: row.karat as Karat,
    weight: row.weight,
    making: row.making,
    rating: row.rating,
    reviews: row.reviews,
    image: row.image_url,
  };
}

export function mapCategory(row: CategoryRow): Category {
  return {
    slug: row.slug,
    labelEn: row.label_en,
    labelAr: row.label_ar,
    sortOrder: row.sort_order,
    active: row.active === 1,
  };
}

function mapRange(row: RangeRow): PriceRange {
  return {
    key: row.key,
    labelEn: row.label_en,
    labelAr: row.label_ar,
    min: row.min_value,
    max: row.max_value ?? Number.POSITIVE_INFINITY,
  };
}

export function readSettingRows(): Record<string, string> {
  const rows = getDb().prepare("SELECT key, value FROM settings").all() as unknown as Array<{
    key: string;
    value: string;
  }>;
  const map: Record<string, string> = {};
  for (const row of rows) map[row.key] = row.value;
  return map;
}

export function toShopSettings(rows: Record<string, string>): ShopSettings {
  const updatedDefault = (value: string | undefined, previous: string, current: string) =>
    !value || value === previous ? current : value;

  return {
    name: rows["shop.name"] ?? "Al-Safa Al-Marwa",
    nameAr: rows["shop.nameAr"] ?? "الصفا المروة",
    tagline: updatedDefault(
      rows["shop.tagline"],
      "Fine gold jewelry in Cairo",
      "Fine gold jewelry in Dekernes, Dakahlia",
    ),
    taglineAr: updatedDefault(
      rows["shop.taglineAr"],
      "مجوهرات ذهب فاخرة في القاهرة",
      "مجوهرات ذهب فاخرة في دكرنس، الدقهلية",
    ),
    phone: rows["shop.phone"] ?? "+20 100 000 0000",
    whatsapp: rows["shop.whatsapp"] ?? "201000000000",
    address: updatedDefault(
      rows["shop.address"],
      "Khan el-Khalili, El-Gamaleya, Cairo",
      "Dekernes, Dakahlia, Egypt",
    ),
    addressAr: updatedDefault(
      rows["shop.addressAr"],
      "خان الخليلي، الجمالية، القاهرة",
      "دكرنس، الدقهلية، مصر",
    ),
    hours: rows["shop.hours"] ?? "Daily 11:00 – 22:00",
    hoursAr: rows["shop.hoursAr"] ?? "يوميًا ١١:٠٠ – ٢٢:٠٠",
  };
}

export function readRateOverride(rows: Record<string, string> = readSettingRows()): RateOverride {
  const fallback = { "24K": 6400, "21K": 5600, "18K": 4800 };
  return {
    enabled: rows["rate.override"] === "1",
    rates: {
      "24K": Number(rows["rate.24K"] ?? fallback["24K"]),
      "21K": Number(rows["rate.21K"] ?? fallback["21K"]),
      "18K": Number(rows["rate.18K"] ?? fallback["18K"]),
    },
  };
}

export function readCatalog(): CatalogData {
  const db = getDb();
  const products = db
    .prepare("SELECT * FROM products WHERE active = 1 ORDER BY sort_order ASC, created_at ASC")
    .all() as unknown as ProductRow[];
  const categories = db
    .prepare("SELECT * FROM categories WHERE active = 1 ORDER BY sort_order ASC, slug ASC")
    .all() as unknown as CategoryRow[];
  const ranges = db
    .prepare("SELECT * FROM price_ranges ORDER BY sort_order ASC, min_value ASC")
    .all() as unknown as RangeRow[];
  const rows = readSettingRows();

  return {
    products: products.map(mapProduct),
    categories: categories.map(mapCategory),
    priceRanges: ranges.map(mapRange),
    settings: toShopSettings(rows),
    rateOverride: readRateOverride(rows),
  };
}

export function readProductById(id: string): Product | null {
  const row = getDb()
    .prepare("SELECT * FROM products WHERE id = ? AND active = 1")
    .get(id) as unknown as ProductRow | undefined;
  return row ? mapProduct(row) : null;
}
