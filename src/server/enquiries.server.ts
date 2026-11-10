import { getDb } from "./db";

type EnquiryInput = {
  productId?: string | undefined;
  productTitle: string;
  karat: string;
  weight: number;
  price: number;
  source: "product_card" | "quick_view" | "product_page";
  name?: string | undefined;
  phone?: string | undefined;
  note?: string | undefined;
};

export function recordEnquiry(data: EnquiryInput): void {
  const db = getDb();
  db.prepare(
    `INSERT INTO enquiries
      (product_id, product_title, karat, weight, price, source, name, phone, note, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?)`,
  ).run(
    data.productId ?? null,
    data.productTitle,
    data.karat,
    data.weight,
    Math.round(data.price),
    data.source,
    data.name ?? null,
    data.phone ?? null,
    data.note ?? null,
    new Date().toISOString(),
  );
}
