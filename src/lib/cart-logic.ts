export type CartLine = { id: string; qty: number };

export const MAX_QTY = 10;

export function addLine(lines: CartLine[], id: string, qty = 1): CartLine[] {
  const existing = lines.find((l) => l.id === id);
  if (existing) {
    return lines.map((l) => (l.id === id ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l));
  }
  return [...lines, { id, qty: Math.min(MAX_QTY, Math.max(1, qty)) }];
}

export function setLineQty(lines: CartLine[], id: string, qty: number): CartLine[] {
  if (qty <= 0) return removeLine(lines, id);
  return lines.map((l) => (l.id === id ? { ...l, qty: Math.min(MAX_QTY, qty) } : l));
}

export function removeLine(lines: CartLine[], id: string): CartLine[] {
  return lines.filter((l) => l.id !== id);
}

export function cartCount(lines: CartLine[]) {
  return lines.reduce((n, l) => n + l.qty, 0);
}

export function cartSubtotal(lines: CartLine[], priceFor: (id: string) => number | undefined) {
  return lines.reduce((sum, l) => sum + (priceFor(l.id) ?? 0) * l.qty, 0);
}

export type OrderItem = { title: string; karat: string; weight: number; qty: number; price: number };

export function buildOrderMessage(shopName: string, items: OrderItem[], format: (n: number) => string) {
  const rows = items.map(
    (it, i) => `${i + 1}. ${it.title} (${it.karat}, ${it.weight}g) × ${it.qty} — ${format(it.price * it.qty)}`,
  );
  const total = items.reduce((s, it) => s + it.price * it.qty, 0);
  return [
    `Hello ${shopName}, I'd like to order:`,
    ...rows,
    `Estimated total: ${format(total)}`,
    "Please confirm availability and today's price.",
  ].join("\n");
}
