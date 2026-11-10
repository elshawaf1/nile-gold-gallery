import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight, MessageCircle, ShieldCheck, Store } from "lucide-react";

import { ProductCard } from "@/components/store/ProductCard";
import { Stars } from "@/components/store/Stars";
import { Button } from "@/components/ui/button";
import { labelForCategory, useCatalog } from "@/lib/catalog";
import { useGoldRates } from "@/lib/gold-rates";
import { useI18n } from "@/lib/i18n";
import { priceBreakdown, priceOf } from "@/lib/products";
import { formatEGP, whatsappLink } from "@/lib/shop";
import { getProductById } from "@/server/catalog";
import { trackEnquiry } from "@/server/enquiries";

export const Route = createFileRoute("/product/$id")({
  loader: async ({ params }) => {
    const product = await getProductById({ data: { id: params.id } });
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    const title = p ? `${p.titleAr} — ${p.title} | الصفا المروة` : "قطعة ذهب | الصفا المروة";
    const description = p
      ? `${p.titleAr}، ${p.weight} جرام عيار ${p.karat}. ${p.descriptionAr}`
      : "مجوهرات ذهب من الصفا المروة، دكرنس، الدقهلية.";
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
      <p className="text-lg font-medium">
        هذه القطعة غير متاحة حاليًا · This piece isn't available.
      </p>
      <Link to="/" className="mt-3 inline-block text-gold-strong underline">
        العودة للمتجر · Back to the store
      </Link>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { rates } = useGoldRates();
  const { lang, t } = useI18n();
  const { products, categories, settings: shop } = useCatalog();
  const price = priceOf(product, rates);
  const breakdown = priceBreakdown(product, rates);
  const rate = rates[product.karat];
  const title = lang === "ar" ? product.titleAr : product.title;
  const subtitle = lang === "ar" ? product.title : product.titleAr;
  const description = lang === "ar" ? product.descriptionAr : product.description;
  const orderText =
    lang === "ar"
      ? `مرحبًا، مهتم بـ ${product.titleAr} (${product.karat}، ${product.weight} جم). هل متوفر؟`
      : `Hello, I'm interested in ${product.title} (${product.karat}, ${product.weight}g). Is it available?`;

  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .concat(products.filter((p) => p.id !== product.id && p.category !== product.category))
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <nav className="flex items-center gap-1 text-xs text-muted-foreground">
        <Link to="/" className="transition-colors hover:text-gold-strong">
          {t("nav.all")}
        </Link>
        <ChevronRight className="size-3 rtl:rotate-180" />
        <Link
          to="/"
          search={{ category: product.category }}
          className="transition-colors hover:text-gold-strong"
        >
          {labelForCategory(categories, product.category, lang)}
        </Link>
      </nav>

      <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_320px]">
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-image-surface">
          <img
            src={product.image}
            alt={title}
            width={1024}
            height={1024}
            className="aspect-square w-full object-cover"
          />
        </div>

        <div className="min-w-0">
          <p className="eyebrow text-gold-strong">
            {product.karat} · {product.weight} {t("unit.g")}
          </p>
          <p className="mt-1 font-arabic text-lg text-muted-foreground">{subtitle}</p>
          <h1 className="mt-1 font-sans text-2xl font-semibold leading-tight sm:text-3xl">
            {title}
          </h1>
          <Stars rating={product.rating} reviews={product.reviews} className="mt-2" />
          <div className="my-4 h-px bg-gradient-to-r from-gold/50 via-border to-transparent" />
          <p className="text-3xl font-semibold text-gold-strong">{formatEGP(price, lang)}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t("product.estimated")}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {product.weight} {t("unit.g")} × ({formatEGP(breakdown.rate, lang)} +{" "}
            {formatEGP(product.making, lang)})
          </p>

          <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border text-sm">
            <Spec label={t("product.karat")} value={product.karat} />
            <Spec label={t("product.weight")} value={`${product.weight} ${t("unit.g")}`} />
            <Spec label={t("product.goldPrice")} value={formatEGP(rate, lang)} />
            <Spec label={t("product.workmanship")} value={formatEGP(product.making, lang)} />
          </dl>

          <p className="mt-5 leading-relaxed text-muted-foreground">{description}</p>
        </div>

        {/* Order box */}
        <aside className="h-fit space-y-4 rounded-2xl border border-gold/25 bg-card p-5 shadow-[var(--shadow-card)]">
          <p className="eyebrow text-muted-foreground">{t("product.inStock")}</p>
          <p className="text-2xl font-semibold text-gold-strong">{formatEGP(price, lang)}</p>
          <Button asChild variant="gold" size="lg" className="w-full">
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
                    price,
                    source: "product_page",
                  },
                });
              }}
            >
              <MessageCircle /> {t("product.order")}
            </a>
          </Button>
          <ul className="space-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
            <li className="flex gap-2">
              <ShieldCheck className="size-4 shrink-0 text-gold-strong" /> {t("product.hallmark")}
            </li>
            <li className="flex gap-2">
              <Store className="size-4 shrink-0 text-gold-strong" /> {t("product.pay")}
            </li>
          </ul>
        </aside>
      </div>

      <section className="mt-16">
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-sans text-xl font-semibold sm:text-2xl">{t("product.alsoLike")}</h2>
          <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        </div>
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
    <div className="bg-surface p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}
