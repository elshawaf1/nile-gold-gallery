import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { MessageCircle, Search, ShoppingCart } from "lucide-react";

import { useCart } from "@/lib/cart";
import { CATEGORIES } from "@/lib/products";
import { formatEGP, GOLD_RATES, SHOP, whatsappLink } from "@/lib/shop";

export function SiteHeader() {
  const { count, setOpen } = useCart();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  function onSearch(e: FormEvent) {
    e.preventDefault();
    navigate({ to: "/", search: { q: q.trim() || undefined } });
  }

  return (
    <header className="sticky top-0 z-40 bg-ink text-ink-foreground">
      {/* Today's gold rate */}
      <div className="border-b border-ink-foreground/10 bg-ink-soft">
        <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto whitespace-nowrap px-4 py-1.5 text-[11px] sm:text-xs">
          <span className="text-ink-foreground/60">Gold today (per gram)</span>
          {(Object.keys(GOLD_RATES) as (keyof typeof GOLD_RATES)[]).map((k) => (
            <span key={k}>
              <span className="font-semibold text-gold">{k}</span> {formatEGP(GOLD_RATES[k])}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3">
        <Link to="/" className="shrink-0 font-display text-3xl leading-none">
          {SHOP.name}
          <span className="text-gold">.</span>
        </Link>

        <form
          onSubmit={onSearch}
          className="order-last flex h-11 w-full overflow-hidden rounded-lg bg-background md:order-none md:w-auto md:flex-1"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search necklaces, rings, gold pounds…"
            aria-label="Search gold"
            className="min-w-0 flex-1 bg-transparent px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button type="submit" aria-label="Search" className="grid w-12 place-items-center bg-gold text-gold-foreground">
            <Search className="size-5" />
          </button>
        </form>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <a
            href={whatsappLink("Hello, I have a question about your gold.")}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-ink-soft sm:flex"
          >
            <MessageCircle className="size-5" />
            <span className="leading-tight">
              <span className="block text-[11px] text-ink-foreground/60">Need help?</span>
              WhatsApp
            </span>
          </a>
          <button
            onClick={() => setOpen(true)}
            aria-label={`Open cart, ${count} items`}
            className="relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-ink-soft"
          >
            <span className="relative">
              <ShoppingCart className="size-6" />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 grid min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] font-bold text-gold-foreground">
                  {count}
                </span>
              )}
            </span>
            <span className="hidden sm:inline">Cart</span>
          </button>
        </div>
      </div>

      <nav className="border-t border-ink-foreground/10 bg-ink-soft">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto whitespace-nowrap px-2 py-1.5 text-sm">
          <Link
            to="/"
            activeOptions={{ exact: true, includeSearch: true }}
            className="rounded-md px-3 py-1.5 hover:bg-ink [&.active]:text-gold"
          >
            All gold
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              to="/"
              search={{ category: c }}
              activeOptions={{ includeSearch: true }}
              className="rounded-md px-3 py-1.5 hover:bg-ink [&.active]:text-gold"
            >
              {c}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
