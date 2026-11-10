import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, MessageCircle, ShoppingCart } from "lucide-react";

import { SearchBox } from "@/components/store/SearchBox";
import { useCart } from "@/lib/cart";
import { CATEGORIES } from "@/lib/products";
import { formatEGP, GOLD_RATES, SHOP, whatsappLink } from "@/lib/shop";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/lib/wishlist";

export function SiteHeader() {
  const { count, setOpen } = useCart();
  const { count: saved } = useWishlist();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-ink text-ink-foreground transition-shadow duration-300",
        scrolled && "shadow-[0_10px_30px_-12px_var(--ink)]",
      )}
    >
      {/* Today's gold rate */}
      <div className="border-b border-ink-foreground/10 bg-ink-soft">
        <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto whitespace-nowrap px-4 py-1.5 text-[11px] sm:text-xs">
          <span className="flex items-center gap-1.5 text-ink-foreground/60">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-gold opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-gold" />
            </span>
            Gold today (per gram)
          </span>
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

        <SearchBox />

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <a
            href={whatsappLink("Hello, I have a question about your gold.")}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-ink-soft lg:flex"
          >
            <MessageCircle className="size-5" />
            <span className="leading-tight">
              <span className="block text-[11px] text-ink-foreground/60">Need help?</span>
              WhatsApp
            </span>
          </a>
          <Link
            to="/wishlist"
            aria-label={`Wishlist, ${saved} saved`}
            className="relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-ink-soft [&.active]:text-gold"
          >
            <span className="relative">
              <Heart className="size-6" />
              {saved > 0 && (
                <span
                  key={saved}
                  className="animate-pop absolute -right-2 -top-2 grid min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] font-bold text-gold-foreground"
                >
                  {saved}
                </span>
              )}
            </span>
            <span className="hidden sm:inline">Saved</span>
          </Link>
          <button
            onClick={() => setOpen(true)}
            aria-label={`Open cart, ${count} items`}
            className="relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-ink-soft"
          >
            <span className="relative" data-cart-target>
              <ShoppingCart className="size-6" />
              {count > 0 && (
                <span
                  key={count}
                  className="animate-pop absolute -right-2 -top-2 grid min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] font-bold text-gold-foreground"
                >
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
            className="rounded-md px-3 py-1.5 transition-colors hover:bg-ink [&.active]:text-gold"
          >
            All gold
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              to="/"
              search={{ category: c }}
              activeOptions={{ includeSearch: true }}
              className="rounded-md px-3 py-1.5 transition-colors hover:bg-ink [&.active]:text-gold"
            >
              {c}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
