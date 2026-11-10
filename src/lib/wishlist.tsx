import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { getProduct } from "@/lib/products";

const STORAGE_KEY = "dahab-wishlist";

type WishlistValue = {
  ids: string[];
  count: number;
  has: (id: string) => boolean;
  toggle: (id: string) => boolean;
  remove: (id: string) => void;
};

const WishlistContext = createContext<WishlistValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setIds((JSON.parse(raw) as string[]).filter((id) => getProduct(id)));
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids, loaded]);

  const has = useCallback((id: string) => ids.includes(id), [ids]);
  const toggle = useCallback(
    (id: string) => {
      const adding = !ids.includes(id);
      setIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
      return adding;
    },
    [ids],
  );
  const remove = useCallback((id: string) => setIds((cur) => cur.filter((x) => x !== id)), []);

  const value = useMemo(
    () => ({ ids, count: ids.length, has, toggle, remove }),
    [ids, has, toggle, remove],
  );
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
