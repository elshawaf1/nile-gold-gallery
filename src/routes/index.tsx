import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";

import heroImage from "@/assets/hero-gold.jpg";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { CATEGORIES, GALLERY, type Category, type GalleryItem } from "@/lib/gallery";
import { cn } from "@/lib/utils";

// Placeholder contact details — replace with the shop's real ones.
const SHOP = {
  name: "Dahab Gold House",
  nameAr: "دار الذهب",
  phone: "+20 100 000 0000",
  whatsapp: "201000000000",
  address: "Khan el-Khalili, El-Gamaleya, Cairo, Egypt",
  hours: "Daily 11:00 – 22:00 · Closed Friday mornings",
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dahab Gold House — Gold Jewelry Gallery, Cairo" },
      {
        name: "description",
        content: "Browse our 18k, 21k and 24k gold necklaces, bangles, rings and bridal sets. Visit our shop in Cairo.",
      },
      { property: "og:title", content: "Dahab Gold House — Gold Jewelry Gallery" },
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
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#top" className="flex items-baseline gap-3">
          <span className="font-display text-2xl font-semibold text-gradient-gold">Dahab</span>
          <span className="font-arabic text-lg text-muted-foreground">{SHOP.nameAr}</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm tracking-wide text-muted-foreground sm:flex">
          <a href="#gallery" className="transition-colors hover:text-primary">Gallery</a>
          <a href="#visit" className="transition-colors hover:text-primary">Visit us</a>
        </nav>
        <Button asChild variant="goldOutline" size="sm">
          <a href={whatsappLink("Hello, I'd like to ask about your gold pieces.")} target="_blank" rel="noreferrer">
            <MessageCircle /> WhatsApp
          </a>
        </Button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative flex min-h-[92vh] items-end overflow-hidden">
      <img
        src={heroImage}
        alt="21k Egyptian gold necklace and engraved bangles on black velvet"
        width={1920}
        height={1088}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-veil" />
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-32">
        <p className="animate-fade-up font-arabic text-2xl text-primary">ذهب مصري أصيل</p>
        <h1 className="animate-fade-up mt-3 max-w-3xl text-5xl font-medium leading-[1.05] sm:text-7xl [animation-delay:120ms]">
          Gold, crafted in the <em className="text-gradient-gold">heart of Cairo</em>
        </h1>
        <p className="animate-fade-up mt-6 max-w-xl text-lg text-muted-foreground [animation-delay:240ms]">
          18k, 21k and 24k pieces — from everyday rings to bridal sets. Browse the collection, then
          visit the shop or message us to reserve.
        </p>
        <div className="animate-fade-up mt-9 flex flex-wrap gap-3 [animation-delay:360ms]">
          <Button asChild variant="gold" size="xl">
            <a href="#gallery">View the collection</a>
          </Button>
          <Button asChild variant="goldOutline" size="xl">
            <a href="#visit">Find the shop</a>
          </Button>
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
    <section id="gallery" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24">
      <div className="text-center">
        <p className="font-arabic text-xl text-primary">المجموعة</p>
        <h2 className="mt-2 text-4xl font-medium sm:text-5xl">The Collection</h2>
        <div className="gold-rule mx-auto mt-6 w-40" />
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm tracking-wide transition-colors",
              active === c
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary/60 hover:text-primary",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => setSelected(item)}
            className={cn(
              "group relative overflow-hidden rounded-lg border border-border text-left shadow-card",
              idx === 0 && active === "All" && "lg:col-span-2 lg:row-span-2",
            )}
          >
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              width={1024}
              height={1024}
              className="aspect-square h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-card-veil" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
              <div>
                <p className="font-arabic text-sm text-primary">{item.titleAr}</p>
                <h3 className="text-2xl font-medium leading-tight">{item.title}</h3>
              </div>
              <span className="shrink-0 rounded-full border border-primary/50 px-2.5 py-0.5 text-xs tracking-widest text-primary">
                {item.karat}
              </span>
            </div>
          </button>
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-muted-foreground">
        Prices follow the daily gold rate — ask us on WhatsApp or visit the shop.
      </p>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl gap-0 overflow-hidden border-border bg-card p-0 sm:grid-cols-2 md:grid md:max-w-4xl">
          {selected && (
            <>
              <img
                src={selected.image}
                alt={selected.title}
                width={1024}
                height={1024}
                className="aspect-square w-full object-cover"
              />
              <div className="flex flex-col justify-center gap-4 p-7">
                <p className="font-arabic text-lg text-primary">{selected.titleAr}</p>
                <DialogTitle className="font-display text-3xl font-medium">{selected.title}</DialogTitle>
                <p className="text-xs tracking-[0.25em] text-muted-foreground uppercase">
                  {selected.category} · {selected.karat} gold
                </p>
                <DialogDescription className="text-base text-muted-foreground">
                  {selected.description}
                </DialogDescription>
                <div className="gold-rule my-2" />
                <Button asChild variant="gold" size="lg">
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
    <section id="visit" className="scroll-mt-20 border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 md:grid-cols-2">
        <div>
          <p className="font-arabic text-xl text-primary">زورونا</p>
          <h2 className="mt-2 text-4xl font-medium sm:text-5xl">Visit the shop</h2>
          <p className="mt-5 max-w-md text-muted-foreground">
            See every piece in person, check the weight on our scale and get today's gold rate. We
            also take custom orders for name necklaces and engraved bangles.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="gold" size="lg">
              <a href={whatsappLink("Hello, I'd like to visit the shop.")} target="_blank" rel="noreferrer">
                <MessageCircle /> WhatsApp us
              </a>
            </Button>
            <Button asChild variant="goldOutline" size="lg">
              <a href={`tel:${SHOP.phone.replace(/\s/g, "")}`}>
                <Phone /> Call
              </a>
            </Button>
          </div>
        </div>
        <ul className="space-y-6 self-center">
          <InfoRow icon={<MapPin />} label="Address" value={SHOP.address} />
          <InfoRow icon={<Clock />} label="Opening hours" value={SHOP.hours} />
          <InfoRow icon={<Phone />} label="Phone" value={SHOP.phone} />
        </ul>
      </div>
    </section>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <li className="flex gap-4 rounded-lg border border-border bg-background/60 p-5">
      <span className="mt-0.5 text-primary [&_svg]:size-5">{icon}</span>
      <div>
        <p className="text-xs tracking-[0.25em] text-muted-foreground uppercase">{label}</p>
        <p className="mt-1 text-lg">{value}</p>
      </div>
    </li>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-muted-foreground sm:flex-row">
        <p>
          <span className="font-display text-lg text-gradient-gold">{SHOP.name}</span> · Cairo, Egypt
        </p>
        <p>© {new Date().getFullYear()} · Gallery only — purchases in store</p>
      </div>
    </footer>
  );
}
