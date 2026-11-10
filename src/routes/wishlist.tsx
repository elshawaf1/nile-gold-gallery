import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { ProductCard } from "@/components/store/ProductCard";
import { Reveal } from "@/components/store/Reveal";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { getProduct, type Product } from "@/lib/products";
import { useWishlist } from "@/lib/wishlist";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Your saved gold pieces | Dahab" },
      { name: "description", content: "The gold necklaces, rings and coins you saved at Dahab." },
      { property: "og:title", content: "Saved gold pieces | Dahab" },
      { property: "og:description", content: "Your wishlist of gold pieces from Dahab, Cairo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { ids } = useWishlist();
  const { add, setOpen } = useCart();
  const items = ids.map(getProduct).filter((p): p is Product => !!p);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
        <div>
          <h1 className="font-sans text-2xl font-semibold">Saved pieces</h1>
          <p className="text-sm text-muted-foreground">{items.length} items</p>
        </div>
        {items.length > 0 && (
          <Button
            variant="ink"
            onClick={() => {
              items.forEach((p) => add(p.id));
              toast.success(`Added ${items.length} pieces to cart`);
              setOpen(true);
            }}
          >
            <ShoppingBag /> Add all to cart
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <div className="grid size-16 place-items-center rounded-full bg-gold-soft">
            <Heart className="size-7" />
          </div>
          <div>
            <p className="font-medium">No saved pieces yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Tap the heart on any piece to save it here.</p>
          </div>
          <Button asChild variant="gold">
            <Link to="/">Browse gold</Link>
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
