import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { Category, PriceRange, ShopSettings } from "@/lib/catalog-types";
import type { Product } from "@/lib/products";
import type { Karat } from "@/lib/shop";
import {
  mapCategory,
  mapProduct,
  readSettingRows,
  toShopSettings,
  type CategoryRow,
} from "./catalog.server";
import { getDb } from "./db";

async function requireAdmin() {
  const { requireAdmin: guard } = await import("./session.server");
  guard();
}

type AdminProductRow = {
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

export type AdminProduct = Product & {
  active: boolean;
  inStock: boolean;
  sortOrder: number;
};

function mapAdminProduct(row: AdminProductRow): AdminProduct {
  return {
    ...mapProduct(row),
    active: row.active === 1,
    inStock: row.in_stock === 1,
    sortOrder: row.sort_order,
  };
}

const productSchema = z.object({
  id: z.string().trim().optional(),
  titleEn: z.string().trim().min(1),
  titleAr: z.string().trim().min(1),
  descriptionEn: z.string().trim().default(""),
  descriptionAr: z.string().trim().default(""),
  category: z.string().trim().min(1),
  karat: z.enum(["24K", "21K", "18K"]),
  weight: z.number().positive(),
  making: z.number().nonnegative(),
  rating: z.number().min(0).max(5),
  reviews: z.number().int().nonnegative(),
  image: z.string().trim().default(""),
  inStock: z.boolean(),
  active: z.boolean(),
  sortOrder: z.number().int(),
});

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || `piece-${Date.now()}`;
}

export const adminListProducts = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminProduct[]> => {
    await requireAdmin();
    const rows = getDb()
      .prepare("SELECT * FROM products ORDER BY sort_order ASC, created_at ASC")
      .all() as unknown as AdminProductRow[];
    return rows.map(mapAdminProduct);
  },
);

export const adminGetProduct = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }): Promise<AdminProduct | null> => {
    await requireAdmin();
    const row = getDb().prepare("SELECT * FROM products WHERE id = ?").get(data.id) as unknown as
      AdminProductRow | undefined;
    return row ? mapAdminProduct(row) : null;
  });

export const adminSaveProduct = createServerFn({ method: "POST" })
  .validator(productSchema)
  .handler(async ({ data }): Promise<{ id: string }> => {
    await requireAdmin();
    const db = getDb();
    const id = data.id?.trim() ? data.id.trim() : slugify(data.titleEn);
    const now = new Date().toISOString();
    const exists = db.prepare("SELECT id FROM products WHERE id = ?").get(id);

    if (exists) {
      db.prepare(
        `UPDATE products SET title_en = ?, title_ar = ?, description_en = ?, description_ar = ?,
          category = ?, karat = ?, weight = ?, making = ?, rating = ?, reviews = ?, image_url = ?,
          in_stock = ?, active = ?, sort_order = ?, updated_at = ? WHERE id = ?`,
      ).run(
        data.titleEn,
        data.titleAr,
        data.descriptionEn,
        data.descriptionAr,
        data.category,
        data.karat,
        data.weight,
        data.making,
        data.rating,
        data.reviews,
        data.image,
        data.inStock ? 1 : 0,
        data.active ? 1 : 0,
        data.sortOrder,
        now,
        id,
      );
    } else {
      db.prepare(
        `INSERT INTO products
          (id, title_en, title_ar, description_en, description_ar, category, karat, weight, making,
           rating, reviews, image_url, in_stock, active, sort_order, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        id,
        data.titleEn,
        data.titleAr,
        data.descriptionEn,
        data.descriptionAr,
        data.category,
        data.karat,
        data.weight,
        data.making,
        data.rating,
        data.reviews,
        data.image,
        data.inStock ? 1 : 0,
        data.active ? 1 : 0,
        data.sortOrder,
        now,
        now,
      );
    }
    return { id };
  });

export const adminDeleteProduct = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }): Promise<{ ok: true }> => {
    await requireAdmin();
    getDb().prepare("DELETE FROM products WHERE id = ?").run(data.id);
    return { ok: true };
  });

export const adminListCategories = createServerFn({ method: "GET" }).handler(
  async (): Promise<Category[]> => {
    await requireAdmin();
    const rows = getDb()
      .prepare("SELECT * FROM categories ORDER BY sort_order ASC, slug ASC")
      .all() as unknown as CategoryRow[];
    return rows.map(mapCategory);
  },
);

const categorySchema = z.object({
  slug: z.string().trim().min(1),
  labelEn: z.string().trim().min(1),
  labelAr: z.string().trim().min(1),
  sortOrder: z.number().int(),
  active: z.boolean(),
});

export const adminSaveCategory = createServerFn({ method: "POST" })
  .validator(categorySchema)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    await requireAdmin();
    getDb()
      .prepare(
        `INSERT INTO categories (slug, label_en, label_ar, sort_order, active)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(slug) DO UPDATE SET
           label_en = excluded.label_en,
           label_ar = excluded.label_ar,
           sort_order = excluded.sort_order,
           active = excluded.active`,
      )
      .run(data.slug, data.labelEn, data.labelAr, data.sortOrder, data.active ? 1 : 0);
    return { ok: true };
  });

export const adminDeleteCategory = createServerFn({ method: "POST" })
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }): Promise<{ ok: true }> => {
    await requireAdmin();
    getDb().prepare("DELETE FROM categories WHERE slug = ?").run(data.slug);
    return { ok: true };
  });

export const adminGetSettings = createServerFn({ method: "GET" }).handler(
  async (): Promise<ShopSettings> => {
    await requireAdmin();
    return toShopSettings(readSettingRows());
  },
);

const settingsSchema = z.object({
  name: z.string().trim().min(1),
  nameAr: z.string().trim().min(1),
  tagline: z.string(),
  taglineAr: z.string(),
  phone: z.string(),
  whatsapp: z.string(),
  address: z.string(),
  addressAr: z.string(),
  hours: z.string(),
  hoursAr: z.string(),
});

export const adminSaveSettings = createServerFn({ method: "POST" })
  .validator(settingsSchema)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    await requireAdmin();
    const db = getDb();
    const upsert = db.prepare(
      "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    );
    const entries: Array<[string, string]> = [
      ["shop.name", data.name],
      ["shop.nameAr", data.nameAr],
      ["shop.tagline", data.tagline],
      ["shop.taglineAr", data.taglineAr],
      ["shop.phone", data.phone],
      ["shop.whatsapp", data.whatsapp],
      ["shop.address", data.address],
      ["shop.addressAr", data.addressAr],
      ["shop.hours", data.hours],
      ["shop.hoursAr", data.hoursAr],
    ];
    for (const [key, value] of entries) upsert.run(key, value);
    return { ok: true };
  });

const ratesSchema = z.object({
  enabled: z.boolean(),
  rates: z.object({
    "24K": z.number().positive(),
    "21K": z.number().positive(),
    "18K": z.number().positive(),
  }),
});

export const adminSaveRates = createServerFn({ method: "POST" })
  .validator(ratesSchema)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    await requireAdmin();
    const db = getDb();
    const upsert = db.prepare(
      "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    );
    upsert.run("rate.override", data.enabled ? "1" : "0");
    (["24K", "21K", "18K"] as Karat[]).forEach((karat) => {
      upsert.run(`rate.${karat}`, String(Math.round(data.rates[karat])));
    });
    return { ok: true };
  });

const rangesSchema = z.object({
  ranges: z.array(
    z.object({
      key: z.string().min(1),
      labelEn: z.string().min(1),
      labelAr: z.string().min(1),
      min: z.number().nonnegative(),
      max: z.number().positive().nullable(),
      sortOrder: z.number().int(),
    }),
  ),
});

export const adminSaveRanges = createServerFn({ method: "POST" })
  .validator(rangesSchema)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    await requireAdmin();
    const db = getDb();
    const upsert = db.prepare(
      `INSERT INTO price_ranges (key, label_en, label_ar, min_value, max_value, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET
         label_en = excluded.label_en,
         label_ar = excluded.label_ar,
         min_value = excluded.min_value,
         max_value = excluded.max_value,
         sort_order = excluded.sort_order`,
    );
    for (const range of data.ranges) {
      upsert.run(
        range.key,
        range.labelEn,
        range.labelAr,
        range.min,
        Number.isFinite(range.max) ? range.max : null,
        range.sortOrder,
      );
    }
    return { ok: true };
  });

export const adminListRanges = createServerFn({ method: "GET" }).handler(
  async (): Promise<PriceRange[]> => {
    await requireAdmin();
    const rows = getDb()
      .prepare("SELECT * FROM price_ranges ORDER BY sort_order ASC, min_value ASC")
      .all() as unknown as Array<{
      key: string;
      label_en: string;
      label_ar: string;
      min_value: number;
      max_value: number | null;
      sort_order: number;
    }>;
    return rows.map((row) => ({
      key: row.key,
      labelEn: row.label_en,
      labelAr: row.label_ar,
      min: row.min_value,
      max: row.max_value ?? Number.POSITIVE_INFINITY,
    }));
  },
);

export const adminDeleteRange = createServerFn({ method: "POST" })
  .validator(z.object({ key: z.string() }))
  .handler(async ({ data }): Promise<{ ok: true }> => {
    await requireAdmin();
    getDb().prepare("DELETE FROM price_ranges WHERE key = ?").run(data.key);
    return { ok: true };
  });

export type Enquiry = {
  id: number;
  productId: string | null;
  productTitle: string;
  karat: string;
  weight: number;
  price: number;
  source: string;
  name: string | null;
  phone: string | null;
  note: string | null;
  status: "new" | "contacted" | "done";
  createdAt: string;
};

type EnquiryRow = {
  id: number;
  product_id: string | null;
  product_title: string;
  karat: string;
  weight: number;
  price: number;
  source: string;
  name: string | null;
  phone: string | null;
  note: string | null;
  status: string;
  created_at: string;
};

function mapEnquiry(row: EnquiryRow): Enquiry {
  return {
    id: row.id,
    productId: row.product_id,
    productTitle: row.product_title,
    karat: row.karat,
    weight: row.weight,
    price: row.price,
    source: row.source,
    name: row.name,
    phone: row.phone,
    note: row.note,
    status: row.status === "contacted" || row.status === "done" ? row.status : "new",
    createdAt: row.created_at,
  };
}

export const adminListEnquiries = createServerFn({ method: "GET" }).handler(
  async (): Promise<Enquiry[]> => {
    await requireAdmin();
    const rows = getDb()
      .prepare("SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 200")
      .all() as unknown as EnquiryRow[];
    return rows.map(mapEnquiry);
  },
);

export const adminUpdateEnquiry = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.number().int(), status: z.enum(["new", "contacted", "done"]) }))
  .handler(async ({ data }): Promise<{ ok: true }> => {
    await requireAdmin();
    getDb().prepare("UPDATE enquiries SET status = ? WHERE id = ?").run(data.status, data.id);
    return { ok: true };
  });

export const adminDeleteEnquiry = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.number().int() }))
  .handler(async ({ data }): Promise<{ ok: true }> => {
    await requireAdmin();
    getDb().prepare("DELETE FROM enquiries WHERE id = ?").run(data.id);
    return { ok: true };
  });

export const adminStats = createServerFn({ method: "GET" }).handler(
  async (): Promise<{
    products: number;
    activeProducts: number;
    enquiries: number;
    newEnquiries: number;
    override: boolean;
  }> => {
    await requireAdmin();
    const db = getDb();
    const products = db.prepare("SELECT COUNT(*) AS count FROM products").get() as {
      count: number;
    };
    const active = db.prepare("SELECT COUNT(*) AS count FROM products WHERE active = 1").get() as {
      count: number;
    };
    const enquiries = db.prepare("SELECT COUNT(*) AS count FROM enquiries").get() as {
      count: number;
    };
    const fresh = db
      .prepare("SELECT COUNT(*) AS count FROM enquiries WHERE status = 'new'")
      .get() as { count: number };
    const override = db.prepare("SELECT value FROM settings WHERE key = 'rate.override'").get() as
      { value: string } | undefined;
    return {
      products: products.count,
      activeProducts: active.count,
      enquiries: enquiries.count,
      newEnquiries: fresh.count,
      override: override?.value === "1",
    };
  },
);
