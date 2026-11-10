import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle } from "lucide-react";

import { Stars } from "@/components/store/Stars";
import { WishlistButton } from "@/components/store/WishlistButton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useShop } from "@/lib/catalog";
import { useGoldRates } from "@/lib/gold-rates";
import { useI18n } from "@/lib/i18n";
import { priceOf, type Product } from "@/lib/products";
import { formatEGP, whatsappLink } from "@/lib/shop";
import { trackEnquiry } from "@/server/enquiries";
import { STATIC_DEMO } from "@/lib/static-demo";

export function QuickView({
  product,
  open,
  onOpenChange,
}: {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { rates } = useGoldRates();
  const { lang, t } = useI18n();
  const shop = useShop();
  const price = priceOf(product, rates);
  const title = lang === "ar" ? product.titleAr : product.title;
  const description = lang === "ar" ? product.descriptionAr : product.description;
  const orderText =
    lang === "ar"
      ? `مرحبًا، مهتم بـ ${product.titleAr} (${product.karat}، ${product.weight} جم). هل متوفر؟`
      : `Hello, I'm interested in ${product.title} (${product.karat}, ${product.weight}g). Is it available?`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-3xl gap-0 overflow-y-auto rounded-2xl border-border p-0 md:grid md:grid-cols-2">
        <div className="relative bg-image-surface">
          <img
            src={product.image}
            alt={title}
            width={1024}
            height={1024}
            className="aspect-[4/3] h-full w-full object-cover md:aspect-square"
          />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <WishlistButton id={product.id} title={title} className="absolute start-3 top-3" />
        </div>
        <div className="flex flex-col gap-3 p-6">
          <p className="eyebrow text-gold-strong">
            {product.karat} · {product.weight} {t("unit.g")}
          </p>
          <p className="font-arabic text-muted-foreground">
            {lang === "ar" ? product.title : product.titleAr}
          </p>
          <DialogTitle className="font-sans text-2xl font-semibold leading-tight">
            {title}
          </DialogTitle>
          <Stars rating={product.rating} reviews={product.reviews} />
          <p className="text-2xl font-semibold text-gold-strong">{formatEGP(price, lang)}</p>
          <p className="text-xs text-muted-foreground">
            {product.weight} {t("unit.g")} × ({formatEGP(rates[product.karat], lang)} +{" "}
            {formatEGP(product.making, lang)}) · {product.karat}
          </p>
          <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </DialogDescription>

          <div className="mt-auto flex flex-col gap-2 pt-4 sm:flex-row">
            <Button asChild variant="gold" size="lg" className="flex-1">
              <a
                href={whatsappLink(orderText, shop.whatsapp)}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  if (!STATIC_DEMO) {
                    void trackEnquiry({
                      data: {
                        productId: product.id,
                        productTitle: title,
                        karat: product.karat,
                        weight: product.weight,
                        price,
                        source: "quick_view",
                      },
                    });
                  }
                }}
              >
                <MessageCircle /> {t("product.order")}
              </a>
            </Button>
            <Button asChild variant="line" size="lg" className="flex-1">
              <Link
                to="/product/$id"
                params={{ id: product.id }}
                onClick={() => onOpenChange(false)}
              >
                {t("quick.details")} <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
