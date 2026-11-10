import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";

import { SHOP, whatsappLink } from "@/lib/shop";

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-3xl">
            {SHOP.name}
            <span className="text-gold">.</span>
          </p>
          <p className="mt-1 font-arabic text-ink-foreground/70">{SHOP.nameAr}</p>
          <p className="mt-3 text-sm text-ink-foreground/60">18K, 21K and 24K gold from Cairo.</p>
        </div>
        <FooterItem icon={<MapPin />} label="Visit" value={SHOP.address} />
        <FooterItem icon={<Clock />} label="Hours" value={SHOP.hours} />
        <div className="space-y-2 text-sm">
          <a href={`tel:${SHOP.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-gold">
            <Phone className="size-4" /> {SHOP.phone}
          </a>
          <a href={whatsappLink("Hello!")} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-gold">
            <MessageCircle className="size-4" /> WhatsApp us
          </a>
        </div>
      </div>
      <div className="border-t border-ink-foreground/10">
        <p className="mx-auto max-w-7xl px-4 py-4 text-xs text-ink-foreground/50">
          © {new Date().getFullYear()} {SHOP.name}. Prices follow the daily gold rate. Orders are confirmed on WhatsApp — pay in store or on delivery.
        </p>
      </div>
    </footer>
  );
}

function FooterItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-3 text-sm">
      <span className="text-gold [&_svg]:size-4">{icon}</span>
      <div>
        <p className="text-ink-foreground/60">{label}</p>
        <p>{value}</p>
      </div>
    </div>
  );
}
