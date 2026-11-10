import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";

import { ProductCard } from "@/components/store/ProductCard";
import { PromoCarousel } from "@/components/store/PromoCarousel";
import { Reveal } from "@/components/store/Reveal";
import { featuredProducts } from "@/lib/featured-products";
import { useGoldRates } from "@/lib/gold-rates";
import { useI18n, type MsgKey } from "@/lib/i18n";
import { KARATS, priceOf } from "@/lib/products";
import { labelForCategory, labelForRange, useCatalog } from "@/lib/catalog";
import { searchProducts } from "@/lib/search";
import { formatEGP, type Karat } from "@/lib/shop";
import { cn } from "@/lib/utils";

const SORTS: Record<string, MsgKey> = {
  featured: "sort.featured",
  "price-asc": "sort.priceAsc",
  "price-desc": "sort.priceDesc",
  rating: "sort.rating",
};
type SortKey = keyof typeof SORTS;

type StoreSearch = {
  q?: string | undefined;
  category?: string | undefined;
  karat?: Karat | undefined;
  sort?: SortKey | undefined;
  price?: string | undefined;
};

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): StoreSearch => {
    const q = s["q"];
    const category = s["category"];
    const karat = s["karat"];
    const sort = s["sort"];
    const price = s["price"];
    return {
      price: typeof price === "string" && price ? price : undefined,
      q: typeof q === "string" && q ? q : undefined,
      category: typeof category === "string" && category ? category : undefined,
      karat:
        typeof karat === "string" && (KARATS as string[]).includes(karat)
          ? (karat as Karat)
          : undefined,
      sort: typeof sort === "string" && sort in SORTS ? (sort as SortKey) : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "الصفا المروة — ذهب عيار ١٨ و٢١ و٢٤ في دكرنس، الدقهلية" },
      {
        name: "description",
        content: "تسوق عقود وخواتم وغوايش وجنيهات وسبائك الذهب بسعر اليوم. تواصل معنا على واتساب.",
      },
      { property: "og:title", content: "الصفا المروة — Al-Safa Al-Marwa" },
      {
        property: "og:description",
        content: "Gold necklaces, rings, bangles, coins and bars in Dekernes, Dakahlia, Egypt.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Store,
});

function Store() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/" });
  const { rates } = useGoldRates();
  const { lang, t } = useI18n();
  const { products, categories, priceRanges } = useCatalog();
  const [featuredSeed, setFeaturedSeed] = useState(0);
  const { q, category, karat, price, sort = "featured" } = search;

  useEffect(() => {
    setFeaturedSeed(Math.floor(Math.random() * 2 ** 32));
  }, []);

  const featured = useMemo(
    () => featuredProducts(products, featuredSeed),
    [products, featuredSeed],
  );

  const results = useMemo(() => {
    const range = price ? priceRanges.find((item) => item.key === price) : undefined;
    let list = searchProducts(products, q ?? "").filter((p) => {
      const pp = priceOf(p, rates);
      return (
        (!category || p.category === category) &&
        (!karat || p.karat === karat) &&
        (!range || (pp >= range.min && pp < range.max))
      );
    });
    if (sort === "price-asc")
      list = [...list].sort((a, b) => priceOf(a, rates) - priceOf(b, rates));
    if (sort === "price-desc")
      list = [...list].sort((a, b) => priceOf(b, rates) - priceOf(a, rates));
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "featured" && !q && !category && !karat && !price) {
      list = featuredProducts(list, featuredSeed);
    }
    return list;
  }, [q, category, karat, price, sort, rates, products, priceRanges, featuredSeed]);

  const setKarat = (k?: Karat) => navigate({ search: (prev) => ({ ...prev, karat: k }) });
  const setPrice = (r?: string) => navigate({ search: (prev) => ({ ...prev, price: r }) });

  const heading = q
    ? t("results.for", { q })
    : category
      ? labelForCategory(categories, category, lang)
      : t("results.all");

  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-5">
      {!q && !category && !karat && !price && <PromoCarousel products={featured} rates={rates} />}

      <div
        id="collection"
        className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[248px_minmax(0,1fr)]"
      >
        {/* Filters (desktop) */}
        <aside className="hidden space-y-8 lg:block">
          <FilterGroup title={t("filter.karat")}>
            <FilterLink active={!karat} onClick={() => setKarat(undefined)}>
              {t("filter.anyKarat")}
            </FilterLink>
            {KARATS.map((k) => (
              <FilterLink key={k} active={karat === k} onClick={() => setKarat(k)}>
                {k}{" "}
                <span className="text-muted-foreground">
                  · {formatEGP(rates[k], lang)}
                  {t("unit.perGram")}
                </span>
              </FilterLink>
            ))}
          </FilterGroup>
          <FilterGroup title={t("filter.price")}>
            <FilterLink active={!price} onClick={() => setPrice(undefined)}>
              {t("filter.anyPrice")}
            </FilterLink>
            {priceRanges.map((range) => (
              <FilterLink
                key={range.key}
                active={price === range.key}
                onClick={() => setPrice(range.key)}
              >
                {labelForRange(range, lang)}
              </FilterLink>
            ))}
          </FilterGroup>
          <FilterGroup title={t("filter.category")}>
            <Link
              to="/"
              search={(prev) => ({ ...prev, category: undefined })}
              className={filterCls(!category)}
            >
              {t("filter.allCategories")}
            </Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                to="/"
                search={(prev) => ({ ...prev, category: c.slug })}
                className={filterCls(category === c.slug)}
              >
                {labelForCategory(categories, c.slug, lang)}
              </Link>
            ))}
          </FilterGroup>
          <div className="rounded-2xl border border-gold/20 bg-gold-soft/60 p-4 text-sm">
            <p className="font-semibold text-gold-strong">{t("pricing.title")}</p>
            <p className="mt-1 leading-relaxed text-muted-foreground">{t("pricing.desc")}</p>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
            <div className="min-w-0">
              <h2 className="truncate font-sans text-xl font-semibold sm:text-2xl">{heading}</h2>
              <p className="text-sm text-muted-foreground">
                {t("results.items", { n: results.length })}
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{t("sort.label")}</span>
              <select
                value={sort}
                onChange={(e) =>
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      sort: e.target.value === "featured" ? undefined : (e.target.value as SortKey),
                    }),
                  })
                }
                className="h-9 rounded-lg border border-input bg-card px-2 text-sm"
              >
                {Object.entries(SORTS).map(([k, labelKey]) => (
                  <option key={k} value={k}>
                    {t(labelKey)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Karat chips (mobile) */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {([undefined, ...KARATS] as (Karat | undefined)[]).map((k) => (
              <button
                key={k ?? "any"}
                onClick={() => setKarat(k)}
                className={cn(
                  "shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                  karat === k
                    ? "border-gold bg-gold text-gold-foreground"
                    : "border-border bg-card",
                )}
              >
                {k ?? t("filter.anyKarat")}
              </button>
            ))}
          </div>

          {(q || category || karat) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {q && (
                <Chip
                  label={`«${q}»`}
                  onClear={() => navigate({ search: (p) => ({ ...p, q: undefined }) })}
                />
              )}
              {category && (
                <Chip
                  label={labelForCategory(categories, category, lang)}
                  onClear={() => navigate({ search: (p) => ({ ...p, category: undefined }) })}
                />
              )}
              {karat && <Chip label={karat} onClear={() => setKarat(undefined)} />}
            </div>
          )}

          {results.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-medium">{t("results.none")}</p>
              <Link to="/" className="mt-2 inline-block text-sm text-gold-strong underline">
                {t("results.seeAll")}
              </Link>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
              {results.map((p, i) => (
                <Reveal key={p.id} delay={(i % 4) * 60} className="h-full">
                  <ProductCard product={p} />
                </Reveal>
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
    "block rounded-lg px-2 py-1.5 text-start text-sm transition-colors",
    active ? "bg-gold-soft font-semibold text-gold-strong" : "hover:bg-muted",
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

function FilterLink({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
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
      className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs transition-colors hover:bg-accent"
    >
      {label} <X className="size-3" />
    </button>
  );
}
