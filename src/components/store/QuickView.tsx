import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { Stars } from "@/components/store/Stars";
import { WishlistButton } from "@/components/store/WishlistButton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useCart } from "@/lib/cart";
import { MAX_QTY } from "@/lib/cart-logic";
import { flyToCart } from "@/lib/fly-to-cart";
import { priceOf, type Product } from "@/lib/products";
import { formatEGP, GOLD_RATES } from "@/lib/shop";

export function QuickView({
  product,
  open,
  onOpenChange,
}: {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const imgRef = useRef<HTMLImageElement>(null);
  const price = priceOf(product);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-3xl gap-0 overflow-y-auto rounded-xl p-0 md:grid md:grid-cols-2">
        <div className="relative bg-card">
          <img
            ref={imgRef}
            src={product.image}
            alt={product.title}
            width={1024}
            height={1024}
            className="aspect-[4/3] h-full w-full object-cover md:aspect-square"
          />
          <WishlistButton id={product.id} title={product.title} className="absolute left-3 top-3" />
        </div>
        <div className="flex flex-col gap-3 p-6">
          <p className="font-arabic text-muted-foreground">{product.titleAr}</p>
          <DialogTitle className="font-sans text-2xl font-semibold leading-tight">{product.title}</DialogTitle>
          <Stars rating={product.rating} reviews={product.reviews} />
          <p className="text-2xl font-semibold">{formatEGP(price * qty)}</p>
          <p className="text-xs text-muted-foreground">
            {product.weight}g × ({formatEGP(GOLD_RATES[product.karat])} + {formatEGP(product.making)} workmanship) · {product.karat}
          </p>
          <DialogDescription className="text-sm text-muted-foreground">{product.description}</DialogDescription>

          <div className="mt-auto flex items-center gap-3 pt-3">
            <div className="flex items-center rounded-full border border-border">
              <button
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid size-10 place-items-center rounded-full hover:bg-muted"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-6 text-center tabular-nums">{qty}</span>
              <button
                aria-label="Increase quantity"
                onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
                className="grid size-10 place-items-center rounded-full hover:bg-muted"
              >
                <Plus className="size-4" />
              </button>
            </div>
            <Button
              variant="gold"
              size="lg"
              className="flex-1"
              onClick={() => {
                flyToCart(imgRef.current);
                add(product.id, qty);
                toast.success("Added to cart", { description: `${qty} × ${product.title}` });
                onOpenChange(false);
                setQty(1);
              }}
            >
              <ShoppingBag /> Add to cart
            </Button>
          </div>
          <Link
            to="/product/$id"
            params={{ id: product.id }}
            onClick={() => onOpenChange(false)}
            className="inline-flex items-center gap-1 self-start text-sm underline-offset-4 hover:underline"
          >
            See full details <ArrowRight className="size-4" />
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
