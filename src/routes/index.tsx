import { useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";

import { ProductCard } from "@/components/store/ProductCard";
import { CATEGORIES, KARATS, PRODUCTS, priceOf } from "@/lib/products";
import { formatEGP, GOLD_RATES, type Karat } from "@/lib/shop";
import { cn } from "@/lib/utils";

const SORTS = {
  featured: "Featured",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  rating: "Top rated",
} as const;
type SortKey = keyof typeof SORTS;

type StoreSearch = {
  q?: string | undefined;
  category?: string | undefined;
  karat?: Karat | undefined;
  sort?: SortKey | undefined;
};

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): StoreSearch => {
    const q = s["q"];
    const category = s["category"];
    const karat = s["karat"];
    const sort = s["sort"];
    return {
      q: typeof q === "string" && q ? q : undefined,
      category: typeof category === "string" && (CATEGORIES as readonly string[]).includes(category) ? category : undefined,
      karat: typeof karat === "string" && (KARATS as string[]).includes(karat) ? (karat as Karat) : undefined,
      sort: typeof sort === "string" && sort in SORTS ? (sort as SortKey) : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Dahab — Shop 18K, 21K & 24K Gold in Egypt" },
      {
        name: "description",
        content: "Shop gold necklaces, rings, bangles, gold pounds and bars at today's gold rate. Order on WhatsApp, pay in store.",
      },
      { property: "og:title", content: "Dahab — Gold Jewelry Store, Cairo" },
      { property: "og:description", content: "Gold necklaces, rings, bangles, coins and bars at today's rate in Egypt." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Store,
});

function Store() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/" });
  const { q, category, karat, sort = "featured" } = search;

  const results = useMemo(() => {
    const term = q?.toLowerCase();
    let list = PRODUCTS.filter(
      (p) =>
        (!category || p.category === category) &&
        (!karat || p.karat === karat) &&
        (!term ||
          p.title.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term) ||
          p.titleAr.includes(q!) ||
          p.karat.toLowerCase() === term),
    );
    if (sort === "price-asc") list = [...list].sort((a, b) => priceOf(a) - priceOf(b));
    if (sort === "price-desc") list = [...list].sort((a, b) => priceOf(b) - priceOf(a));
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [q, category, karat, sort]);

  const setKarat = (k?: Karat) => navigate({ search: (prev) => ({ ...prev, karat: k }) });

  const heading = q ? `Results for “${q}”` : category ?? "All gold";

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* Filters (desktop) */}
        <aside className="hidden space-y-8 lg:block">
          <FilterGroup title="Karat">
            <FilterLink active={!karat} onClick={() => setKarat(undefined)}>
              Any karat
            </FilterLink>
            {KARATS.map((k) => (
              <FilterLink key={k} active={karat === k} onClick={() => setKarat(k)}>
                {k} <span className="text-muted-foreground">· {formatEGP(GOLD_RATES[k])}/g</span>
              </FilterLink>
            ))}
          </FilterGroup>
          <FilterGroup title="Category">
            <Link to="/" search={(prev) => ({ ...prev, category: undefined })} className={filterCls(!category)}>
              All categories
            </Link>
            {CATEGORIES.map((c) => (
              <Link key={c} to="/" search={(prev) => ({ ...prev, category: c })} className={filterCls(category === c)}>
                {c}
              </Link>
            ))}
          </FilterGroup>
          <div className="rounded-lg bg-gold-soft p-4 text-sm">
            <p className="font-semibold">How pricing works</p>
            <p className="mt-1 text-muted-foreground">
              Weight × today's gram rate + workmanship. Final price confirmed by the shop.
            </p>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
            <div className="min-w-0">
              <h1 className="truncate font-sans text-xl font-semibold sm:text-2xl">{heading}</h1>
              <p className="text-sm text-muted-foreground">{results.length} items</p>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Sort by</span>
              <select
                value={sort}
                onChange={(e) =>
                  navigate({
                    search: (prev) => ({ ...prev, sort: e.target.value === "featured" ? undefined : (e.target.value as SortKey) }),
                  })
                }
                className="h-9 rounded-md border border-input bg-background px-2 text-sm"
              >
                {Object.entries(SORTS).map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Karat chips (mobile) */}
          <div className="mt-4 flex gap-2 overflow-x-auto lg:hidden">
            {([undefined, ...KARATS] as (Karat | undefined)[]).map((k) => (
              <button
                key={k ?? "any"}
                onClick={() => setKarat(k)}
                className={cn(
                  "shrink-0 rounded-full border px-3.5 py-1.5 text-sm",
                  karat === k ? "border-ink bg-ink text-ink-foreground" : "border-border",
                )}
              >
                {k ?? "Any karat"}
              </button>
            ))}
          </div>

          {(q || category || karat) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {q && <Chip label={`“${q}”`} onClear={() => navigate({ search: (p) => ({ ...p, q: undefined }) })} />}
              {category && <Chip label={category} onClear={() => navigate({ search: (p) => ({ ...p, category: undefined }) })} />}
              {karat && <Chip label={karat} onClear={() => setKarat(undefined)} />}
            </div>
          )}

          {results.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-medium">No pieces match your search.</p>
              <Link to="/" className="mt-2 inline-block text-sm underline">
                See all gold
              </Link>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function filterCls(active: boolean) {
  return cn(
    "block rounded-md px-2 py-1.5 text-left text-sm transition-colors",
    active ? "bg-gold-soft font-semibold" : "hover:bg-muted",
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold">{title}</p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function FilterLink({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={cn(filterCls(active), "w-full")}>
      {children}
    </button>
  );
}

function Chip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <button
      onClick={onClear}
      className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs hover:bg-accent"
    >
      {label} <X className="size-3" />
    </button>
  );
}
