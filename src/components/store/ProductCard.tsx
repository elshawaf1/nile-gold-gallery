import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { Stars } from "@/components/store/Stars";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { priceOf, type Product } from "@/lib/products";
import { formatEGP } from "@/lib/shop";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border bg-background transition-shadow hover:shadow-[0_12px_30px_-18px_var(--ink)]">
      <Link to="/product/$id" params={{ id: product.id }} className="relative block overflow-hidden bg-card">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          width={1024}
          height={1024}
          className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute left-2.5 top-2.5 rounded-full bg-gold px-2 py-0.5 text-[11px] font-semibold text-gold-foreground">
          {product.karat}
        </span>
      </Link>
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
            add(product.id);
            toast.success("Added to cart", { description: product.title });
          }}
        >
          <ShoppingBag /> Add to cart
        </Button>
      </div>
    </article>
  );
}
