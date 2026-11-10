import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Eye, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { QuickView } from "@/components/store/QuickView";
import { Stars } from "@/components/store/Stars";
import { WishlistButton } from "@/components/store/WishlistButton";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { flyToCart } from "@/lib/fly-to-cart";
import { priceOf, type Product } from "@/lib/products";
import { formatEGP } from "@/lib/shop";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [quickOpen, setQuickOpen] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-22px_var(--ink)]">
      <div className="relative overflow-hidden bg-card">
        <Link to="/product/$id" params={{ id: product.id }} className="block">
          <img
            ref={imgRef}
            src={product.image}
            alt={product.title}
            loading="lazy"
            width={1024}
            height={1024}
            className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          />
        </Link>
        <span className="pointer-events-none absolute left-2.5 top-2.5 rounded-full bg-gold px-2 py-0.5 text-[11px] font-semibold text-gold-foreground">
          {product.karat}
        </span>
        <WishlistButton id={product.id} title={product.title} className="absolute right-2.5 top-2.5" />
        <button
          type="button"
          onClick={() => setQuickOpen(true)}
          aria-label={`Quick view ${product.title}`}
          className="absolute right-2.5 top-13 grid size-9 place-items-center rounded-full bg-background/90 shadow-sm backdrop-blur transition-all hover:scale-110 lg:inset-x-3 lg:top-auto lg:bottom-3 lg:flex lg:size-auto lg:translate-y-3 lg:gap-2 lg:py-2 lg:text-sm lg:font-medium lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:hover:scale-100"
        >
          <Eye className="size-[18px]" />
          <span className="hidden lg:inline">Quick view</span>
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className="line-clamp-2 text-sm font-medium leading-snug hover:underline sm:text-[15px]"
        >
          {product.title}
        </Link>
        <Stars rating={product.rating} reviews={product.reviews} />
        <p className="text-xs text-muted-foreground">
          {product.weight}g · {product.category}
        </p>
        <p className="mt-auto pt-2 text-lg font-semibold tracking-tight">{formatEGP(priceOf(product))}</p>
        <Button
          variant="gold"
          size="sm"
          className="mt-1 w-full"
          onClick={() => {
            flyToCart(imgRef.current);
            add(product.id);
            toast.success("Added to cart", { description: product.title });
          }}
        >
          <ShoppingBag /> Add to cart
        </Button>
      </div>
      <QuickView product={product} open={quickOpen} onOpenChange={setQuickOpen} />
    </article>
  );
}
