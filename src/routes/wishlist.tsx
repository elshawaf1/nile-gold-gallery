import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

import { ProductCard } from "@/components/store/ProductCard";
import { Reveal } from "@/components/store/Reveal";
import { Button } from "@/components/ui/button";
import { useCatalog } from "@/lib/catalog";
import { useI18n } from "@/lib/i18n";
import { useWishlist } from "@/lib/wishlist";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "القطع المحفوظة | الصفا المروة" },
      { name: "description", content: "القطع الذهبية التي حفظتها في الصفا المروة." },
      { property: "og:title", content: "Saved gold pieces | Al-Safa Al-Marwa" },
      {
        property: "og:description",
        content: "Your wishlist of gold pieces from Dekernes, Dakahlia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { ids } = useWishlist();
  const { t } = useI18n();
  const { products } = useCatalog();
  const items = products.filter((product) => ids.includes(product.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
        <div>
          <p className="eyebrow mb-2 text-gold-strong">Al-Safa Al-Marwa</p>
          <h1 className="font-sans text-2xl font-semibold sm:text-3xl">{t("wishlist.title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("wishlist.items", { n: items.length })}
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <div className="grid size-16 place-items-center rounded-full border border-gold/25 bg-gold/10 text-gold-strong">
            <Heart className="size-7" />
          </div>
          <div>
            <p className="font-medium">{t("wishlist.empty")}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t("wishlist.emptyHint")}</p>
          </div>
          <Button asChild variant="gold">
            <Link to="/">{t("action.browse")}</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
          {items.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 70} className="h-full">
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
