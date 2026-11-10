import { writeFile } from "node:fs/promises";

const response = await fetch("https://goldbullioneg.com/", {
  headers: { accept: "text/html" },
  signal: AbortSignal.timeout(15000),
});

if (!response.ok) {
  throw new Error(`Gold Bullion responded ${response.status}`);
}

const html = await response.text();
const rates = {};

for (const [karat, displayKarat] of [
  ["24K", "24"],
  ["21K", "21"],
  ["18K", "18"],
]) {
  const rows = html.match(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi) ?? [];
  const row = rows.find((candidate) => {
    const text = candidate.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ");
    return new RegExp(`جرام\\s*عيار\\s*${displayKarat}(?:\\s|<)`, "i").test(text);
  });
  const cells = row?.match(/<td\b[^>]*>[\s\S]*?<\/td>/gi) ?? [];
  const buyCell = cells.find((cell) => {
    const attributes = cell.match(/^<td\b([^>]*)>/i)?.[1] ?? "";
    const classes = attributes.match(/\bclass=["']([^"']*)["']/i)?.[1] ?? "";
    const names = classes.split(/\s+/);
    return names.includes("num") && !names.includes("td-arrow");
  });
  const attributes = buyCell?.match(/^<td\b([^>]*)>/i)?.[1] ?? "";
  const value = attributes.match(/\bdata-val=["']([^"']+)["']/i)?.[1];
  const rate = value ? Number(value.replace(/[,\s]/g, "")) : null;

  if (rate === null || !Number.isFinite(rate) || rate <= 0) {
    throw new Error(`Gold Bullion page did not contain a valid ${karat} buy rate`);
  }

  rates[karat] = rate;
}

await writeFile(
  new URL("../src/lib/static-demo-rates.json", import.meta.url),
  `${JSON.stringify({ updatedAt: new Date().toISOString(), rates }, null, 2)}\n`,
);

console.log("Fetched Gold Bullion static demo rates:", rates);
