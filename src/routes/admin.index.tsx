import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Coins, MessageCircle, Package, PackageCheck } from "lucide-react";

import { Card, EmptyState, PageHeader } from "@/components/admin/ui";
import { useI18n } from "@/lib/i18n";
import { useGoldRates } from "@/lib/gold-rates";
import { formatEGP } from "@/lib/shop";
import { adminListEnquiries, adminStats } from "@/server/admin";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin · Safa" }, { name: "robots", content: "noindex" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { t, lang } = useI18n();
  const { rates, live } = useGoldRates();
  const stats = useQuery({ queryKey: ["admin", "stats"], queryFn: () => adminStats() });
  const enquiries = useQuery({
    queryKey: ["admin", "enquiries"],
    queryFn: () => adminListEnquiries(),
  });

  const cards = [
    { label: t("admin.dashboard.products"), value: stats.data?.products ?? "—", icon: Package },
    {
      label: t("admin.dashboard.active"),
      value: stats.data?.activeProducts ?? "—",
      icon: PackageCheck,
    },
    {
      label: t("admin.dashboard.enquiries"),
      value: stats.data?.enquiries ?? "—",
      icon: MessageCircle,
    },
    {
      label: t("admin.dashboard.newEnquiries"),
      value: stats.data?.newEnquiries ?? "—",
      icon: MessageCircle,
    },
  ];

  return (
    <div>
      <PageHeader title={t("admin.nav.dashboard")} />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label} className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">{card.label}</p>
              <p className="mt-1 text-2xl font-semibold">{card.value}</p>
            </div>
            <card.icon className="size-6 text-gold" />
          </Card>
        ))}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold">
              <Coins className="size-4 text-gold" />
              {t("admin.dashboard.rates")}
            </h2>
            <span className="text-xs text-muted-foreground">
              {stats.data?.override
                ? t("admin.dashboard.manual")
                : live
                  ? t("admin.dashboard.live")
                  : "—"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {(["24K", "21K", "18K"] as const).map((karat) => (
              <div key={karat} className="rounded-lg border border-border px-2 py-3">
                <div className="text-xs text-muted-foreground">{karat}</div>
                <div className="mt-1 text-sm font-semibold">{formatEGP(rates[karat])}</div>
              </div>
            ))}
          </div>
          <Link to="/admin/prices" className="mt-3 inline-block text-sm text-gold hover:underline">
            {t("admin.nav.prices")}
          </Link>
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">{t("admin.dashboard.latest")}</h2>
            <Link to="/admin/orders" className="text-sm text-gold hover:underline">
              {t("admin.nav.orders")}
            </Link>
          </div>
          {enquiries.data && enquiries.data.length > 0 ? (
            <ul className="space-y-2">
              {enquiries.data.slice(0, 5).map((enquiry) => (
                <li key={enquiry.id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="truncate">{enquiry.productTitle}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {new Date(enquiry.createdAt).toLocaleDateString(
                      lang === "ar" ? "ar-EG" : "en-GB",
                    )}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState>{t("admin.dashboard.empty")}</EmptyState>
          )}
        </Card>
      </div>
    </div>
  );
}
