import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Eye, MessageCircle } from "lucide-react";

import { QuickView } from "@/components/store/QuickView";
import { Stars } from "@/components/store/Stars";
import { WishlistButton } from "@/components/store/WishlistButton";
import { Button } from "@/components/ui/button";
import { useShop } from "@/lib/catalog";
import { useGoldRates } from "@/lib/gold-rates";
import { useI18n } from "@/lib/i18n";
import { categoryLabel, priceOf, type Product } from "@/lib/products";
import { formatEGP, whatsappLink } from "@/lib/shop";
import { trackEnquiry } from "@/server/enquiries";

export function ProductCard({ product }: { product: Product }) {
  const { rates } = useGoldRates();
  const { lang, t } = useI18n();
  const shop = useShop();
  const [quickOpen, setQuickOpen] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const title = lang === "ar" ? product.titleAr : product.title;
  const orderText =
    lang === "ar"
      ? `مرحبًا، مهتم بـ ${product.titleAr} (${product.karat}، ${product.weight} جم). هل متوفر؟`
      : `Hello, I'm interested in ${product.title} (${product.karat}, ${product.weight}g). Is it available?`;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-[var(--shadow-gold)]">
      <div className="relative overflow-hidden bg-image-surface">
        <Link to="/product/$id" params={{ id: product.id }} className="block">
          <img
            ref={imgRef}
            src={product.image}
            alt={title}
            loading="lazy"
            width={1024}
            height={1024}
            className="aspect-square w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
          />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-30" />
        </Link>
        <span className="pointer-events-none absolute start-2.5 top-2.5 rounded-full border border-gold/30 bg-background/85 px-2.5 py-0.5 text-[11px] font-semibold text-gold-strong backdrop-blur">
          {product.karat}
        </span>
        <WishlistButton id={product.id} title={title} className="absolute end-2.5 top-2.5" />
        <button
          type="button"
          onClick={() => setQuickOpen(true)}
          aria-label={`${t("card.quickView")} ${title}`}
          className="absolute end-2.5 top-13 grid size-9 place-items-center rounded-full border border-border/60 bg-background/85 text-foreground shadow-sm backdrop-blur transition-all hover:scale-110 hover:border-gold hover:text-gold lg:inset-x-3 lg:top-auto lg:bottom-3 lg:flex lg:size-auto lg:translate-y-3 lg:gap-2 lg:py-2 lg:text-sm lg:font-medium lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:hover:scale-100"
        >
          <Eye className="size-[18px]" />
          <span className="hidden lg:inline">{t("card.quickView")}</span>
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3.5 sm:p-4">
        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className="line-clamp-2 text-sm font-medium leading-snug transition-colors hover:text-gold-strong sm:text-[15px]"
        >
          {title}
        </Link>
        <Stars rating={product.rating} reviews={product.reviews} />
        <p className="text-xs text-muted-foreground">
          {product.weight} {t("unit.g")} · {categoryLabel(product.category, lang)}
        </p>
        <p className="mt-auto pt-2 text-lg font-semibold tracking-tight text-gold-strong">
          {formatEGP(priceOf(product, rates), lang)}
        </p>
        <Button asChild variant="gold" size="sm" className="mt-1 w-full">
          <a
            href={whatsappLink(orderText, shop.whatsapp)}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
              void trackEnquiry({
                data: {
                  productId: product.id,
                  productTitle: title,
                  karat: product.karat,
                  weight: product.weight,
                  price: priceOf(product, rates),
                  source: "product_card",
                },
              });
            }}
          >
            <MessageCircle /> {t("product.order")}
          </a>
        </Button>
      </div>
      <QuickView product={product} open={quickOpen} onOpenChange={setQuickOpen} />
    </article>
  );
}
