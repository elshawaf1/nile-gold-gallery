import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight, MessageCircle, ShieldCheck, ShoppingBag, Store } from "lucide-react";
import { toast } from "sonner";

import { ProductCard } from "@/components/store/ProductCard";
import { Stars } from "@/components/store/Stars";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { getProduct, PRODUCTS, priceOf } from "@/lib/products";
import { formatEGP, GOLD_RATES, whatsappLink } from "@/lib/shop";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    const title = p ? `${p.title} — ${p.karat} Gold | Dahab` : "Gold piece | Dahab";
    const description = p ? `${p.title}, ${p.weight}g of ${p.karat} gold. ${p.description}` : "Gold jewelry from Dahab, Cairo.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-7xl px-4 py-24 text-center">
      <p className="text-lg font-medium">This piece isn't available.</p>
      <Link to="/" className="mt-3 inline-block underline">
        Back to the store
      </Link>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { add, setOpen } = useCart();
  const [qty, setQty] = useState(1);
  const price = priceOf(product);
  const rate = GOLD_RATES[product.karat];
  const related = PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category)
    .concat(PRODUCTS.filter((p) => p.id !== product.id && p.category !== product.category))
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <nav className="flex items-center gap-1 text-xs text-muted-foreground">
        <Link to="/" className="hover:underline">All gold</Link>
        <ChevronRight className="size-3" />
        <Link to="/" search={{ category: product.category }} className="hover:underline">
          {product.category}
        </Link>
      </nav>

      <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_300px]">
        <div className="overflow-hidden rounded-lg bg-card">
          <img src={product.image} alt={product.title} width={1024} height={1024} className="aspect-square w-full object-cover" />
        </div>

        <div className="min-w-0">
          <p className="font-arabic text-lg text-muted-foreground">{product.titleAr}</p>
          <h1 className="font-sans text-2xl font-semibold leading-tight sm:text-3xl">{product.title}</h1>
          <Stars rating={product.rating} reviews={product.reviews} className="mt-2" />
          <div className="my-4 h-px bg-border" />
          <p className="text-3xl font-semibold">{formatEGP(price)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Estimated at today's gold rate</p>

          <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border text-sm">
            <Spec label="Karat" value={product.karat} />
            <Spec label="Weight" value={`${product.weight} g`} />
            <Spec label="Gold price / g" value={formatEGP(rate)} />
            <Spec label="Workmanship / g" value={formatEGP(product.making)} />
          </dl>

          <p className="mt-5 leading-relaxed text-muted-foreground">{product.description}</p>
        </div>

        {/* Buy box */}
        <aside className="h-fit space-y-4 rounded-lg border border-border p-5">
          <p className="text-2xl font-semibold">{formatEGP(price * qty)}</p>
          <p className="text-sm font-medium text-gold-foreground">
            <span className="rounded bg-gold-soft px-1.5 py-0.5">In stock</span>
          </p>
          <label className="flex items-center gap-2 text-sm">
            Qty
            <select
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="h-9 rounded-md border border-input bg-background px-2"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
          <Button
            variant="gold"
            size="lg"
            className="w-full"
            onClick={() => {
              add(product.id, qty);
              toast.success("Added to cart", {
                description: `${qty} × ${product.title}`,
                action: { label: "View cart", onClick: () => setOpen(true) },
              });
            }}
          >
            <ShoppingBag /> Add to cart
          </Button>
          <Button asChild variant="ink" size="lg" className="w-full">
            <a
              href={whatsappLink(`Hello, I'd like to order ${qty} × ${product.title} (${product.karat}, ${product.weight}g). Is it available?`)}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle /> Order on WhatsApp
            </a>
          </Button>
          <ul className="space-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
            <li className="flex gap-2"><ShieldCheck className="size-4 shrink-0" /> Hallmarked gold with invoice</li>
            <li className="flex gap-2"><Store className="size-4 shrink-0" /> Pay in store or on delivery</li>
          </ul>
        </aside>
      </div>

      <section className="mt-14">
        <h2 className="font-sans text-xl font-semibold">You may also like</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-background p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}
