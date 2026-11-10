import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { addLine, cartCount, cartSubtotal, removeLine, setLineQty, type CartLine } from "@/lib/cart-logic";
import { getProduct, priceOf } from "@/lib/products";

const STORAGE_KEY = "dahab-cart";

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function priceFor(id: string) {
  const p = getProduct(id);
  return p ? priceOf(p) : undefined;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        setLines(parsed.filter((l) => getProduct(l.id) && l.qty > 0));
      }
    } catch {
      /* ignore broken storage */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, loaded]);

  const add = useCallback((id: string, qty = 1) => setLines((l) => addLine(l, id, qty)), []);
  const setQty = useCallback((id: string, qty: number) => setLines((l) => setLineQty(l, id, qty)), []);
  const remove = useCallback((id: string) => setLines((l) => removeLine(l, id)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(
    () => ({
      lines,
      count: cartCount(lines),
      subtotal: cartSubtotal(lines, priceFor),
      open,
      setOpen,
      add,
      setQty,
      remove,
      clear,
    }),
    [lines, open, add, setQty, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
