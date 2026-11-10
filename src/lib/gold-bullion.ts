import type { Karat } from "@/lib/shop";

export const GOLD_BULLION_URL = "https://goldbullioneg.com/";

const GOLD_BULLION_KARATS: Record<Karat, string> = {
  "24K": "24",
  "21K": "21",
  "18K": "18",
};

export type GoldBullionRates = {
  rates: Record<Karat, number>;
  updatedAt: string;
};

function parsePositivePrice(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number(value.replace(/[,\s]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

/** Reads Gold Bullion's first (شراء) price column from its public gold table. */
export function parseGoldBullionRates(html: string): GoldBullionRates | null {
  const rows = html.match(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi) ?? [];
  const rates = {} as Record<Karat, number>;

  for (const [karat, displayKarat] of Object.entries(GOLD_BULLION_KARATS) as Array<
    [Karat, string]
  >) {
    const row = rows.find((candidate) => {
      const text = candidate.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ");
      return new RegExp(`جرام\\s*عيار\\s*${displayKarat}(?:\\s|<)`, "i").test(text);
    });
    if (!row) return null;

    const cells = row.match(/<td\b[^>]*>[\s\S]*?<\/td>/gi) ?? [];
    const buyCell = cells.find((cell) => {
      const attributes = cell.match(/^<td\b([^>]*)>/i)?.[1] ?? "";
      const classes = attributes.match(/\bclass=["']([^"']*)["']/i)?.[1] ?? "";
      return classes.split(/\s+/).includes("num") && !classes.split(/\s+/).includes("td-arrow");
    });
    const attributes = buyCell?.match(/^<td\b([^>]*)>/i)?.[1] ?? "";
    const value = attributes.match(/\bdata-val=["']([^"']+)["']/i)?.[1];
    const rate = parsePositivePrice(value);
    if (rate === null) return null;
    rates[karat] = rate;
  }

  return { rates, updatedAt: new Date().toISOString() };
}
