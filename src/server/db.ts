import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";

import { DEFAULT_SETTINGS, SEED_CATEGORIES, SEED_PRICE_RANGES, SEED_PRODUCTS } from "./seed-data";

const DATA_DIR = process.env["DATA_DIR"] ?? join(process.cwd(), "data");
export const DB_PATH = process.env["DATABASE_PATH"] ?? join(DATA_DIR, "shop.db");
export const UPLOAD_DIR = process.env["UPLOAD_DIR"] ?? join(DATA_DIR, "uploads");
const SEED_IMAGES_DIR = join(process.cwd(), "src", "assets");

function ensureDirs() {
  mkdirSync(DATA_DIR, { recursive: true });
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

function migrate(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_meta (
      version INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS categories (
      slug TEXT PRIMARY KEY,
      label_en TEXT NOT NULL,
      label_ar TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      title_en TEXT NOT NULL,
      title_ar TEXT NOT NULL,
      description_en TEXT NOT NULL DEFAULT '',
      description_ar TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL,
      karat TEXT NOT NULL,
      weight REAL NOT NULL,
      making REAL NOT NULL,
      rating REAL NOT NULL DEFAULT 5,
      reviews INTEGER NOT NULL DEFAULT 0,
      image_url TEXT NOT NULL DEFAULT '',
      in_stock INTEGER NOT NULL DEFAULT 1,
      active INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS price_ranges (
      key TEXT PRIMARY KEY,
      label_en TEXT NOT NULL,
      label_ar TEXT NOT NULL,
      min_value INTEGER NOT NULL,
      max_value INTEGER,
      sort_order INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id TEXT,
      product_title TEXT NOT NULL,
      karat TEXT NOT NULL,
      weight REAL NOT NULL,
      price INTEGER NOT NULL,
      source TEXT NOT NULL,
      name TEXT,
      phone TEXT,
      note TEXT,
      status TEXT NOT NULL DEFAULT 'new',
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at DESC);
  `);

  const updateDefault = db.prepare("UPDATE settings SET value = ? WHERE key = ? AND value = ?");
  updateDefault.run(
    "Fine gold jewelry in Dekernes, Dakahlia",
    "shop.tagline",
    "Fine gold jewelry in Cairo",
  );
  updateDefault.run(
    "مجوهرات ذهب فاخرة في دكرنس، الدقهلية",
    "shop.taglineAr",
    "مجوهرات ذهب فاخرة في القاهرة",
  );
  updateDefault.run(
    "Dekernes, Dakahlia, Egypt",
    "shop.address",
    "Khan el-Khalili, El-Gamaleya, Cairo",
  );
  updateDefault.run("دكرنس، الدقهلية، مصر", "shop.addressAr", "خان الخليلي، الجمالية، القاهرة");
}

function seedImages() {
  for (const product of SEED_PRODUCTS) {
    const source = join(SEED_IMAGES_DIR, product.imageFile);
    const target = join(UPLOAD_DIR, `seed-${product.imageFile}`);
    try {
      if (existsSync(source) && !existsSync(target)) copyFileSync(source, target);
    } catch (error) {
      console.error(`[db] Could not copy seed image ${product.imageFile}`, error);
    }
  }
}

function seedIfEmpty(db: DatabaseSync) {
  const row = db.prepare("SELECT COUNT(*) AS count FROM products").get() as
    { count: number } | undefined;
  if (row && row.count > 0) return;

  seedImages();
  const now = new Date().toISOString();

  const insertCategory = db.prepare(
    "INSERT OR IGNORE INTO categories (slug, label_en, label_ar, sort_order, active) VALUES (?, ?, ?, ?, 1)",
  );
  SEED_CATEGORIES.forEach((category, index) => {
    insertCategory.run(category.slug, category.labelEn, category.labelAr, index);
  });

  const insertRange = db.prepare(
    "INSERT OR IGNORE INTO price_ranges (key, label_en, label_ar, min_value, max_value, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
  );
  SEED_PRICE_RANGES.forEach((range, index) => {
    insertRange.run(
      range.key,
      range.labelEn,
      range.labelAr,
      range.min,
      range.max >= 0 ? range.max : null,
      index,
    );
  });

  const insertSetting = db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)");
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) insertSetting.run(key, value);

  const insertProduct = db.prepare(`
    INSERT OR IGNORE INTO products
      (id, title_en, title_ar, description_en, description_ar, category, karat, weight, making,
       rating, reviews, image_url, in_stock, active, sort_order, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?, ?, ?)
  `);
  SEED_PRODUCTS.forEach((product, index) => {
    insertProduct.run(
      product.id,
      product.titleEn,
      product.titleAr,
      product.descriptionEn,
      product.descriptionAr,
      product.category,
      product.karat,
      product.weight,
      product.making,
      product.rating,
      product.reviews,
      `/api/uploads/seed-${product.imageFile}`,
      index,
      now,
      now,
    );
  });
}

let instance: DatabaseSync | undefined;
const registry = globalThis as unknown as { __safaDb?: DatabaseSync };

export function getDb(): DatabaseSync {
  if (registry.__safaDb) return registry.__safaDb;
  if (instance) return instance;

  ensureDirs();
  const db = new DatabaseSync(DB_PATH);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");
  migrate(db);
  seedIfEmpty(db);
  registry.__safaDb = db;
  instance = db;
  return db;
}
