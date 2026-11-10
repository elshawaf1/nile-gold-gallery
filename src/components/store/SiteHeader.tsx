import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Languages, MessageCircle } from "lucide-react";

import { SearchBox } from "@/components/store/SearchBox";
import { ThemeToggle } from "@/components/store/ThemeToggle";
import { useGoldRates } from "@/lib/gold-rates";
import { useI18n } from "@/lib/i18n";
import { useCatalog, labelForCategory } from "@/lib/catalog";
import { formatEGP, whatsappLink, type Karat } from "@/lib/shop";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/lib/wishlist";

export function SiteHeader() {
  const { count: saved } = useWishlist();
  const { rates, live, source } = useGoldRates();
  const { lang, t, toggle } = useI18n();
  const { categories, settings: shop } = useCatalog();
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
        "sticky top-0 z-40 border-b border-border/70 bg-background/85 text-foreground backdrop-blur-xl transition-shadow duration-300",
        scrolled && "shadow-[var(--shadow-card)]",
      )}
    >
      {/* Today's gold rate */}
      <div className="border-b border-border/60 bg-muted/60">
        <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto whitespace-nowrap px-4 py-1.5 text-[11px] sm:text-xs">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-gold opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-gold" />
            </span>
            {t("gold.today")}
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px]",
                live ? "bg-gold/15 text-gold-strong" : "bg-muted text-muted-foreground",
              )}
            >
              {source === "manual" ? t("gold.manual") : live ? t("gold.live") : t("gold.offline")}
            </span>
          </span>
          {(Object.keys(rates) as Karat[]).map((k) => (
            <span key={k}>
              <span className="font-semibold text-gold-strong">{k}</span>{" "}
              {formatEGP(rates[k], lang)}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3">
        <Link to="/" className="shrink-0 font-display text-3xl leading-none">
          <span className="gold-text">{shop.nameAr}</span>
          <span className="mx-1 text-gold">·</span>
          <span className="hidden text-lg text-muted-foreground sm:inline">{shop.name}</span>
        </Link>

        <SearchBox />

        <div className="ms-auto flex items-center gap-1 md:ms-0">
          <ThemeToggle />
          <button
            type="button"
            onClick={toggle}
            aria-label={t("lang.aria")}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            <Languages className="size-5 text-gold-strong" />
            <span className="hidden sm:inline">{t("lang.switch")}</span>
          </button>
          <a
            href={whatsappLink(t("whatsapp.greeting"), shop.whatsapp)}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent lg:flex"
          >
            <MessageCircle className="size-5 text-gold-strong" />
            <span className="leading-tight">
              <span className="block text-[11px] text-muted-foreground">{t("help.need")}</span>
              {t("action.whatsapp")}
            </span>
          </a>
          <Link
            to="/wishlist"
            aria-label={t("wishlist.open", { n: saved })}
            className="relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent [&.active]:text-gold-strong"
          >
            <span className="relative">
              <Heart className="size-6" />
              {saved > 0 && (
                <span
                  key={saved}
                  className="animate-pop absolute -end-2 -top-2 grid min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] font-bold text-gold-foreground"
                >
                  {saved}
                </span>
              )}
            </span>
            <span className="hidden sm:inline">{t("action.saved")}</span>
          </Link>
        </div>
      </div>

      <nav className="border-t border-border/60 bg-card/60">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto whitespace-nowrap px-2 py-1.5 text-sm">
          <Link
            to="/"
            activeOptions={{ exact: true, includeSearch: true }}
            className="rounded-md px-3 py-1.5 transition-colors hover:bg-accent [&.active]:text-gold-strong"
          >
            {t("nav.all")}
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/"
              search={{ category: c.slug }}
              activeOptions={{ includeSearch: true }}
              className="rounded-md px-3 py-1.5 transition-colors hover:bg-accent [&.active]:text-gold-strong"
            >
              {labelForCategory(categories, c.slug, lang)}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
