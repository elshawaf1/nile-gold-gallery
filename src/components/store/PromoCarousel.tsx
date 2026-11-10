import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Pause, Play, Sparkles } from "lucide-react";

import { useI18n } from "@/lib/i18n";
import { priceOf, type Product } from "@/lib/products";
import type { GoldRates } from "@/lib/gold-rates";
import { formatEGP } from "@/lib/shop";
import { cn } from "@/lib/utils";

const ROTATE_MS = 6000;

export function PromoCarousel({ products, rates }: { products: Product[]; rates: GoldRates }) {
  const { lang, t } = useI18n();
  const [active, setActive] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [hovered, setHovered] = useState(false);
  const slides = products.slice(0, 3);

  useEffect(() => {
    if (!autoPlay || hovered || slides.length < 2) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [autoPlay, hovered, slides.length]);

  useEffect(() => {
    setActive((current) => (slides.length ? current % slides.length : 0));
  }, [slides.length]);

  if (slides.length === 0) return null;

  const product = slides[active]!;
  const title = lang === "ar" ? product.titleAr : product.title;
  const description = lang === "ar" ? product.descriptionAr : product.description;
  const previous = () => setActive((current) => (current - 1 + slides.length) % slides.length);
  const next = () => setActive((current) => (current + 1) % slides.length);

  return (
    <section
      aria-label={t("promo.carousel")}
      aria-roledescription={t("promo.carouselRole")}
      className="relative mb-8 overflow-hidden rounded-[1.75rem] bg-ink text-ink-foreground shadow-[var(--shadow-card)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        key={product.id}
        className="relative isolate grid min-h-[310px] items-center sm:min-h-[350px] lg:min-h-[390px]"
      >
        <img
          src={product.image}
          alt={title}
          width={1024}
          height={1024}
          fetchPriority="high"
          className="absolute inset-0 -z-20 size-full object-cover object-center opacity-50 sm:inset-y-0 sm:start-auto sm:w-[62%] sm:opacity-100"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-l from-ink/15 via-ink/85 to-ink sm:from-ink/5 sm:via-ink/70 sm:to-ink" />
        <div className="max-w-3xl px-6 pb-20 pt-9 sm:px-10 sm:py-12 lg:px-14">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold/35 bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold">
            <Sparkles className="size-3.5" />
            {t("promo.eyebrow")}
          </p>
          <h2 className="max-w-xl text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-3 line-clamp-2 max-w-lg text-sm leading-relaxed text-ink-foreground/75 sm:text-base">
            {description}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-gold px-4 py-2 text-sm font-bold text-gold-foreground">
              {formatEGP(priceOf(product, rates), lang)}
            </span>
            <span className="text-xs text-ink-foreground/65">
              {product.karat} · {product.weight} {t("unit.g")}
            </span>
          </div>
          <Link
            to="/product/$id"
            params={{ id: product.id }}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-gold-foreground transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            {t("promo.shopNow")}
            <ArrowRight className="size-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>

      <div className="absolute inset-x-4 bottom-3 flex items-center justify-between gap-3 sm:inset-x-6">
        <div className="flex items-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={t("promo.goToSlide", { n: index + 1 })}
              aria-current={active === index ? "true" : undefined}
              onClick={() => setActive(index)}
              className={cn(
                "h-2.5 rounded-full transition-all",
                active === index ? "w-7 bg-gold" : "w-2.5 bg-ink-foreground/50 hover:bg-gold/70",
              )}
            />
          ))}
          <span className="ms-1 text-[11px] text-ink-foreground/60">
            {active + 1} / {slides.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={autoPlay ? t("promo.pause") : t("promo.play")}
            onClick={() => setAutoPlay((playing) => !playing)}
            className="grid size-9 place-items-center rounded-full border border-ink-foreground/20 bg-ink/55 text-ink-foreground transition hover:border-gold hover:text-gold"
          >
            {autoPlay ? <Pause className="size-4" /> : <Play className="size-4" />}
          </button>
          <button
            type="button"
            aria-label={t("promo.previous")}
            onClick={previous}
            className="grid size-9 place-items-center rounded-full border border-ink-foreground/20 bg-ink/55 text-ink-foreground transition hover:border-gold hover:text-gold"
          >
            <ArrowLeft className="size-4 rtl:rotate-180" />
          </button>
          <button
            type="button"
            aria-label={t("promo.next")}
            onClick={next}
            className="grid size-9 place-items-center rounded-full border border-ink-foreground/20 bg-ink/55 text-ink-foreground transition hover:border-gold hover:text-gold"
          >
            <ArrowRight className="size-4 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </section>
  );
}
