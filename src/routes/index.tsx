import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, MessageCircle, Phone } from "lucide-react";

import heroImage from "@/assets/hero-gold.jpg";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { CATEGORIES, GALLERY, type Category, type GalleryItem } from "@/lib/gallery";
import { cn } from "@/lib/utils";

// Placeholder contact details — replace with the shop's real ones.
const SHOP = {
  name: "Dahab",
  nameAr: "دار الذهب",
  phone: "+20 100 000 0000",
  whatsapp: "201000000000",
  address: "Khan el-Khalili, El-Gamaleya, Cairo",
  hours: "Daily 11:00 – 22:00",
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dahab — Gold Jewelry Gallery, Cairo" },
      {
        name: "description",
        content: "Browse 18k, 21k and 24k gold necklaces, bangles, rings and bridal sets. Visit our shop in Cairo.",
      },
      { property: "og:title", content: "Dahab — Gold Jewelry Gallery" },
      { property: "og:description", content: "Fine Egyptian gold jewelry. Browse the collection, then visit us in Cairo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function whatsappLink(text: string) {
  return `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(text)}`;
}

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <Gallery />
      <Visit />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#top" className="font-display text-2xl">
          {SHOP.name}
          <span className="text-gold">.</span>
        </a>
        <nav className="flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#gallery" className="hidden transition-colors hover:text-foreground sm:inline">
            Collection
          </a>
          <a href="#visit" className="hidden transition-colors hover:text-foreground sm:inline">
            Visit
          </a>
          <a
            href={whatsappLink("Hello, I'd like to ask about your gold pieces.")}
            target="_blank"
            rel="noreferrer"
            className="text-foreground underline-offset-4 hover:underline"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="mx-auto max-w-6xl px-6 pb-20 pt-12 md:pt-20">
      <div className="grid items-end gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="eyebrow animate-fade-up">Fine gold · Cairo</p>
          <h1 className="animate-fade-up mt-5 text-6xl leading-[0.95] sm:text-7xl [animation-delay:100ms]">
            Gold, kept <em className="text-gold">simple.</em>
          </h1>
          <p className="animate-fade-up mt-6 max-w-sm text-muted-foreground [animation-delay:200ms]">
            18k, 21k and 24k pieces, made in Egypt. Browse online — see and buy in store.
          </p>
          <div className="animate-fade-up mt-8 flex gap-3 [animation-delay:300ms]">
            <Button asChild variant="ink" size="lg">
              <a href="#gallery">View collection</a>
            </Button>
            <Button asChild variant="line" size="lg">
              <a href="#visit">Visit us</a>
            </Button>
          </div>
        </div>
        <div className="animate-fade-up md:col-span-7 [animation-delay:150ms]">
          <img
            src={heroImage}
            alt="21k Egyptian gold necklace and engraved bangles"
            width={1920}
            height={1088}
            className="aspect-[4/3] w-full rounded-sm object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const [active, setActive] = useState<Category>("All");
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  const items = useMemo(
    () => (active === "All" ? GALLERY : GALLERY.filter((i) => i.category === active)),
    [active],
  );

  return (
    <section id="gallery" className="scroll-mt-16 border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Collection</p>
            <h2 className="mt-3 text-5xl">Selected pieces</h2>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={cn(
                  "border-b pb-1 transition-colors",
                  active === c
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <button key={item.id} onClick={() => setSelected(item)} className="group text-left">
              <div className="overflow-hidden rounded-sm bg-card">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <h3 className="text-2xl">{item.title}</h3>
                <span className="eyebrow shrink-0">{item.karat}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{item.category}</p>
            </button>
          ))}
        </div>

        <p className="mt-16 text-sm text-muted-foreground">
          Prices follow the daily gold rate. Message us for today's price.
        </p>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-4xl gap-0 overflow-hidden rounded-sm border-border bg-background p-0 md:grid md:grid-cols-2">
          {selected && (
            <>
              <img
                src={selected.image}
                alt={selected.title}
                width={1024}
                height={1024}
                className="aspect-[4/3] h-full w-full object-cover md:aspect-square"
              />
              <div className="flex flex-col justify-center gap-4 p-8">
                <p className="eyebrow">
                  {selected.category} · {selected.karat}
                </p>
                <DialogTitle className="font-display text-4xl font-normal">{selected.title}</DialogTitle>
                <DialogDescription className="text-base text-muted-foreground">
                  {selected.description}
                </DialogDescription>
                <Button asChild variant="ink" size="lg" className="mt-4 self-start">
                  <a
                    href={whatsappLink(`Hello, I'm interested in the "${selected.title}" (${selected.karat}). Is it available?`)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle /> Ask about this piece
                  </a>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function Visit() {
  return (
    <section id="visit" className="scroll-mt-16 border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2">
        <div>
          <p className="eyebrow">Visit</p>
          <h2 className="mt-3 text-5xl">Come see it in person.</h2>
          <p className="mt-5 max-w-sm text-muted-foreground">
            Every piece is weighed in front of you at today's rate. Custom name necklaces available.
          </p>
        </div>
        <div className="divide-y divide-border border-y border-border text-sm">
          <Row label="Address" value={SHOP.address} />
          <Row label="Hours" value={SHOP.hours} />
          <a href={`tel:${SHOP.phone.replace(/\s/g, "")}`} className="group flex items-center justify-between py-5">
            <span className="eyebrow">Phone</span>
            <span className="flex items-center gap-2">
              <Phone className="size-4" /> {SHOP.phone}
            </span>
          </a>
          <a
            href={whatsappLink("Hello, I'd like to visit the shop.")}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-between py-5"
          >
            <span className="eyebrow">WhatsApp</span>
            <span className="flex items-center gap-1 transition-colors group-hover:text-gold">
              Message us <ArrowUpRight className="size-4" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-6 py-5">
      <span className="eyebrow">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-2 px-6 py-8 text-xs text-muted-foreground sm:flex-row">
        <p>
          © {new Date().getFullYear()} {SHOP.name} · <span className="font-arabic text-sm">{SHOP.nameAr}</span>
        </p>
        <p>Gallery only — purchases in store.</p>
      </div>
    </footer>
  );
}
