import { Link } from "@tanstack/react-router";
import { MessageCircle, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { buildOrderMessage } from "@/lib/cart-logic";
import { getProduct, priceOf, type Product } from "@/lib/products";
import { formatEGP, SHOP, whatsappLink } from "@/lib/shop";

export function CartSheet() {
  const { lines, count, subtotal, open, setOpen, setQty, remove, clear } = useCart();

  const items = lines
    .map((l) => ({ line: l, product: getProduct(l.id) }))
    .filter((x): x is { line: typeof x.line; product: Product } => !!x.product);

  const orderText = buildOrderMessage(
    SHOP.name,
    items.map(({ line, product }) => ({
      title: product.title,
      karat: product.karat,
      weight: product.weight,
      qty: line.qty,
      price: priceOf(product),
    })),
    formatEGP,
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-5 py-4 text-left">
          <SheetTitle className="font-sans text-lg font-semibold">Your cart ({count})</SheetTitle>
          <SheetDescription className="text-xs">
            No online payment — send your order to the shop on WhatsApp.
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="grid size-16 place-items-center rounded-full bg-gold-soft text-gold-foreground">
              <ShoppingBag className="size-7" />
            </div>
            <div>
              <p className="font-medium">Your cart is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">Add a necklace, ring or gold pound to get started.</p>
            </div>
            <Button variant="ink" onClick={() => setOpen(false)} asChild>
              <Link to="/">Browse gold</Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-5">
              {items.map(({ line, product }) => (
                <li key={product.id} className="flex gap-3 py-4">
                  <Link
                    to="/product/$id"
                    params={{ id: product.id }}
                    onClick={() => setOpen(false)}
                    className="shrink-0 overflow-hidden rounded-md bg-card"
                  >
                    <img src={product.image} alt={product.title} width={80} height={80} className="size-20 object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="truncate text-sm font-medium">{product.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.karat} · {product.weight}g
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                      <div className="flex items-center rounded-full border border-border">
                        <button
                          aria-label="Decrease quantity"
                          onClick={() => setQty(product.id, line.qty - 1)}
                          className="grid size-8 place-items-center rounded-full hover:bg-muted"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm tabular-nums">{line.qty}</span>
                        <button
                          aria-label="Increase quantity"
                          onClick={() => setQty(product.id, line.qty + 1)}
                          className="grid size-8 place-items-center rounded-full hover:bg-muted"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold">{formatEGP(priceOf(product) * line.qty)}</p>
                    </div>
                  </div>
                  <button
                    aria-label={`Remove ${product.title}`}
                    onClick={() => remove(product.id)}
                    className="self-start p-1 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="space-y-3 border-t border-border bg-card px-5 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Estimated total</span>
                <span className="text-xl font-semibold">{formatEGP(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Final price is confirmed by the shop at today's gold rate. Pay in store or on delivery.
              </p>
              <Button asChild variant="gold" size="lg" className="w-full">
                <a href={whatsappLink(orderText)} target="_blank" rel="noreferrer">
                  <MessageCircle /> Send order on WhatsApp
                </a>
              </Button>
              <button onClick={clear} className="w-full text-xs text-muted-foreground hover:text-foreground">
                Clear cart
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
