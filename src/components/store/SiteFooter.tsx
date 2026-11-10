import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";

import { useCatalog } from "@/lib/catalog";
import { useI18n } from "@/lib/i18n";
import { whatsappLink } from "@/lib/shop";

export function SiteFooter() {
  const { lang, t } = useI18n();
  const { settings: shop } = useCatalog();
  const address = lang === "ar" ? shop.addressAr : shop.address;
  const hours = lang === "ar" ? shop.hoursAr : shop.hours;

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-gold/20 bg-ink text-ink-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-3xl">
            <span className="gold-text">{shop.nameAr}</span>
            <span className="mx-1 text-gold">·</span>
            <span className="text-xl text-ink-foreground/85">{shop.name}</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-foreground/60">
            {lang === "ar" ? shop.taglineAr : shop.tagline}
          </p>
          <div className="mt-5 flex gap-2">
            <span className="h-1 w-10 rounded-full bg-gold" />
            <span className="h-1 w-4 rounded-full bg-gold/50" />
            <span className="h-1 w-2 rounded-full bg-gold/25" />
          </div>
        </div>
        <FooterItem icon={<MapPin />} label={t("footer.visit")} value={address} />
        <FooterItem icon={<Clock />} label={t("footer.hours")} value={hours} />
        <div className="space-y-3 text-sm">
          <a
            href={`tel:${shop.phone.replace(/\s/g, "")}`}
            className="flex items-center gap-2 transition-colors hover:text-gold"
          >
            <Phone className="size-4 text-gold" /> {shop.phone}
          </a>
          <a
            href={whatsappLink(t("whatsapp.hello"), shop.whatsapp)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 transition-colors hover:text-gold"
          >
            <MessageCircle className="size-4 text-gold" /> {t("footer.whatsapp")}
          </a>
        </div>
      </div>
      <div className="border-t border-ink-foreground/10">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs leading-relaxed text-ink-foreground/45">
          © {new Date().getFullYear()} {lang === "ar" ? shop.nameAr : shop.name}.{" "}
          {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}

function FooterItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 text-sm">
      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-gold/10 text-gold [&_svg]:size-4">
        {icon}
      </span>
      <div>
        <p className="text-xs uppercase tracking-wider text-ink-foreground/50">{label}</p>
        <p className="mt-1 leading-relaxed text-ink-foreground/90">{value}</p>
      </div>
    </div>
  );
}
