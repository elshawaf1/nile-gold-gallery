import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { ArrowUpRight, Clock, Search, TrendingUp, X } from "lucide-react";

import { labelForCategory, useCatalog } from "@/lib/catalog";
import { useGoldRates } from "@/lib/gold-rates";
import { useI18n } from "@/lib/i18n";
import { priceOf } from "@/lib/products";
import { matchingCategories, searchProducts } from "@/lib/search";
import { formatEGP } from "@/lib/shop";
import { cn } from "@/lib/utils";

const RECENT_KEY = "dahab-recent-searches";
const POPULAR = {
  en: ["Gold pound", "21K", "Name necklace", "Bangles", "سبيكة", "Bridal set"],
  ar: ["جنيه ذهب", "عيار ٢١", "سلسلة بالاسم", "غوايش", "سبيكة", "طقم شبكة"],
};

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-sm bg-gold-soft text-foreground">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

export function SearchBox() {
  const navigate = useNavigate();
  const { rates } = useGoldRates();
  const { lang, t } = useI18n();
  const { products: catalogProducts, categories } = useCatalog();
  const popular = POPULAR[lang];
  const urlQ = useRouterState({ select: (s) => (s.location.search as { q?: string }).q ?? "" });
  const [q, setQ] = useState(urlQ);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => setQ(urlQ), [urlQ]);

  useEffect(() => {
    try {
      setRecent(JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? "[]") as string[]);
    } catch {
      /* ignore */
    }
  }, []);

  // Press "/" anywhere to jump to search
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const term = q.trim();
  const allMatches = useMemo(
    () => (term ? searchProducts(catalogProducts, term) : []),
    [term, catalogProducts],
  );
  const products = allMatches.slice(0, 5);
  const cats = useMemo(
    () =>
      term
        ? matchingCategories(
            categories.map((category) => category.slug),
            term,
          ).slice(0, 3)
        : [],
    [term, categories],
  );

  // Keyboard-navigable options: products, then "see all"
  const optionCount = term ? products.length + 1 : 0;

  function saveRecent(value: string) {
    const next = [value, ...recent.filter((r) => r.toLowerCase() !== value.toLowerCase())].slice(
      0,
      5,
    );
    setRecent(next);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  }

  function runSearch(value: string) {
    const v = value.trim();
    if (v) saveRecent(v);
    setQ(v);
    setOpen(false);
    inputRef.current?.blur();
    navigate({ to: "/", search: { q: v || undefined } });
  }

  function openProduct(id: string) {
    if (term) saveRecent(term);
    setOpen(false);
    inputRef.current?.blur();
    navigate({ to: "/product/$id", params: { id } });
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (!optionCount) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (a + 1) % optionCount);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a <= 0 ? optionCount - 1 : a - 1));
    } else if (e.key === "Enter" && active >= 0 && active < products.length) {
      e.preventDefault();
      openProduct(products[active]!.id);
    }
  }

  return (
    <div ref={wrapRef} className="relative order-last w-full md:order-none md:w-auto md:flex-1">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          runSearch(q);
        }}
        className={cn(
          "flex h-11 overflow-hidden rounded-lg border border-border bg-card ring-2 ring-transparent transition-shadow",
          open && "ring-gold",
        )}
      >
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(-1);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={t("search.placeholder")}
          aria-label={t("search.aria")}
          role="combobox"
          aria-expanded={open}
          aria-controls="search-suggestions"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        {q && (
          <button
            type="button"
            aria-label={t("search.clear")}
            onClick={() => {
              setQ("");
              inputRef.current?.focus();
            }}
            className="grid w-9 place-items-center text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
        <kbd className="my-auto me-2 hidden rounded border border-border px-1.5 text-[11px] text-muted-foreground lg:block">
          /
        </kbd>
        <button
          type="submit"
          aria-label={t("search.submit")}
          className="grid w-12 place-items-center bg-gold text-gold-foreground"
        >
          <Search className="size-5" />
        </button>
      </form>

      {open && (
        <div
          id="search-suggestions"
          role="listbox"
          className="absolute inset-x-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-xl border border-border bg-popover p-2 text-popover-foreground shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {!term ? (
            <div className="space-y-4 p-2">
              {recent.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground">
                      {t("search.recent")}
                    </p>
                    <button
                      onClick={() => {
                        setRecent([]);
                        window.localStorage.removeItem(RECENT_KEY);
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      {t("search.clearRecent")}
                    </button>
                  </div>
                  <ul>
                    {recent.map((r) => (
                      <li key={r}>
                        <button
                          onClick={() => runSearch(r)}
                          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-start text-sm hover:bg-muted"
                        >
                          <Clock className="size-4 text-muted-foreground" /> {r}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <p className="mb-2 flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                  <TrendingUp className="size-3.5" /> {t("search.popular")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {popular.map((p) => (
                    <button
                      key={p}
                      onClick={() => runSearch(p)}
                      className="rounded-full border border-border px-3 py-1 text-sm transition-colors hover:border-gold hover:bg-gold-soft"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {cats.length > 0 && (
                <div className="flex flex-wrap gap-2 px-2 pb-2 pt-1">
                  {cats.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setOpen(false);
                        navigate({ to: "/", search: { category: c } });
                      }}
                      className="rounded-full bg-gold-soft px-3 py-1 text-xs font-medium"
                    >
                      {t("search.in", { c: labelForCategory(categories, c, lang) })}
                    </button>
                  ))}
                </div>
              )}
              {products.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                  {t("search.none", { q: term })}
                </p>
              ) : (
                <ul>
                  {products.map((p, i) => (
                    <li key={p.id} role="option" aria-selected={active === i}>
                      <button
                        onMouseEnter={() => setActive(i)}
                        onClick={() => openProduct(p.id)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg p-2 text-start transition-colors",
                          active === i && "bg-muted",
                        )}
                      >
                        <img
                          src={p.image}
                          alt=""
                          width={48}
                          height={48}
                          className="size-12 shrink-0 rounded-md object-cover"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">
                            <Highlight text={p.title} query={term} />
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {p.karat} · {p.weight}
                            {t("unit.g")} · {labelForCategory(categories, p.category, lang)}
                          </span>
                        </span>
                        <span className="shrink-0 text-sm font-semibold">
                          {formatEGP(priceOf(p, rates), lang)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <button
                role="option"
                aria-selected={active === products.length}
                onMouseEnter={() => setActive(products.length)}
                onClick={() => runSearch(term)}
                className={cn(
                  "mt-1 flex w-full items-center justify-between rounded-lg border-t border-border px-3 py-2.5 text-sm",
                  active === products.length && "bg-muted",
                )}
              >
                <span>{t("search.seeAll", { n: allMatches.length, q: term })}</span>
                <ArrowUpRight className="size-4" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
