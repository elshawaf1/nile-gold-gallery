import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, Field, PageHeader, TextInput, Toggle } from "@/components/admin/ui";
import { useCatalog } from "@/lib/catalog";
import { useGoldRates } from "@/lib/gold-rates";
import { useI18n } from "@/lib/i18n";
import { formatEGP, type Karat } from "@/lib/shop";
import { adminDeleteRange, adminListRanges, adminSaveRanges, adminSaveRates } from "@/server/admin";

export const Route = createFileRoute("/admin/prices")({
  head: () => ({
    meta: [{ title: "Prices · Safa Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: PricesPage,
});

type RangeDraft = {
  key: string;
  labelEn: string;
  labelAr: string;
  min: string;
  max: string;
  sortOrder: string;
};

const KARATS: Karat[] = ["24K", "21K", "18K"];

function PricesPage() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const { rateOverride } = useCatalog();
  const { rates: liveRates } = useGoldRates();

  const [enabled, setEnabled] = useState(rateOverride.enabled);
  const [rates, setRates] = useState<Record<Karat, string>>({
    "24K": String(rateOverride.rates["24K"]),
    "21K": String(rateOverride.rates["21K"]),
    "18K": String(rateOverride.rates["18K"]),
  });
  const [ranges, setRanges] = useState<RangeDraft[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const rangesQuery = useQuery({ queryKey: ["admin", "ranges"], queryFn: () => adminListRanges() });

  useEffect(() => {
    if (!rangesQuery.data) return;
    setRanges(
      rangesQuery.data.map((range, index) => ({
        key: range.key,
        labelEn: range.labelEn,
        labelAr: range.labelAr,
        min: String(range.min),
        max: Number.isFinite(range.max) ? String(range.max) : "",
        sortOrder: String(index),
      })),
    );
  }, [rangesQuery.data]);

  async function refresh() {
    setSaved(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["catalog"] }),
      queryClient.invalidateQueries({ queryKey: ["gold-rates"] }),
      queryClient.invalidateQueries({ queryKey: ["admin", "ranges"] }),
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] }),
    ]);
    window.setTimeout(() => setSaved(false), 2000);
  }

  const saveRates = useMutation({
    mutationFn: () =>
      adminSaveRates({
        data: {
          enabled,
          rates: {
            "24K": Number(rates["24K"]) || liveRates["24K"],
            "21K": Number(rates["21K"]) || liveRates["21K"],
            "18K": Number(rates["18K"]) || liveRates["18K"],
          },
        },
      }),
    onSuccess: refresh,
    onError: () => setError(t("common.error")),
  });

  const saveRanges = useMutation({
    mutationFn: () =>
      adminSaveRanges({
        data: {
          ranges: ranges
            .filter((range) => range.key.trim() && range.labelEn.trim() && range.labelAr.trim())
            .map((range, index) => ({
              key: range.key.trim(),
              labelEn: range.labelEn.trim(),
              labelAr: range.labelAr.trim(),
              min: Number(range.min) || 0,
              max: range.max.trim() === "" ? null : Number(range.max),
              sortOrder: Math.round(Number(range.sortOrder) || index),
            })),
        },
      }),
    onSuccess: refresh,
    onError: () => setError(t("common.error")),
  });

  const removeRange = useMutation({
    mutationFn: (key: string) => adminDeleteRange({ data: { key } }),
    onSuccess: refresh,
  });

  function setRange(index: number, key: keyof RangeDraft, value: string) {
    setRanges((prev) => prev.map((range, i) => (i === index ? { ...range, [key]: value } : range)));
  }

  return (
    <div>
      <PageHeader
        title={t("admin.prices.title")}
        actions={
          saved ? <span className="text-sm text-emerald-500">{t("common.saved")}</span> : null
        }
      />

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-semibold">{t("admin.dashboard.rates")}</h2>
          <Toggle
            checked={enabled}
            onChange={setEnabled}
            label={t("admin.prices.override")}
            hint={t("admin.prices.overrideHint")}
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {KARATS.map((karat) => (
              <Field key={karat} label={`${karat} · ${t("admin.prices.perGram")}`}>
                <TextInput
                  type="number"
                  min="1"
                  step="1"
                  value={rates[karat]}
                  onChange={(e) => setRates((prev) => ({ ...prev, [karat]: e.target.value }))}
                />
                <span className="text-xs text-muted-foreground">{formatEGP(liveRates[karat])}</span>
              </Field>
            ))}
          </div>
          <Button
            type="button"
            variant="gold"
            className="mt-4 w-full"
            onClick={() => saveRates.mutate()}
            disabled={saveRates.isPending}
          >
            {saveRates.isPending ? t("common.saving") : t("common.save")}
          </Button>
        </Card>

        <Card>
          <h2 className="mb-3 font-semibold">{t("admin.prices.ranges")}</h2>
          <div className="space-y-3">
            {ranges.map((range, index) => (
              <div key={index} className="rounded-lg border border-border p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <TextInput
                    value={range.key}
                    onChange={(e) => setRange(index, "key", e.target.value)}
                    placeholder="under-10"
                    className="h-8 text-xs"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={t("common.delete")}
                    disabled={!range.key || removeRange.isPending}
                    onClick={() => {
                      if (window.confirm(t("common.delete"))) removeRange.mutate(range.key);
                    }}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <TextInput
                    value={range.labelEn}
                    onChange={(e) => setRange(index, "labelEn", e.target.value)}
                    placeholder="English label"
                  />
                  <TextInput
                    dir="rtl"
                    value={range.labelAr}
                    onChange={(e) => setRange(index, "labelAr", e.target.value)}
                    placeholder="الاسم بالعربي"
                  />
                  <TextInput
                    type="number"
                    min="0"
                    value={range.min}
                    onChange={(e) => setRange(index, "min", e.target.value)}
                    placeholder={t("admin.prices.min")}
                  />
                  <TextInput
                    type="number"
                    min="0"
                    value={range.max}
                    onChange={(e) => setRange(index, "max", e.target.value)}
                    placeholder={`${t("admin.prices.max")} (∞)`}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() =>
                setRanges((prev) => [
                  ...prev,
                  {
                    key: "",
                    labelEn: "",
                    labelAr: "",
                    min: "0",
                    max: "",
                    sortOrder: String(prev.length),
                  },
                ])
              }
            >
              <Plus className="size-4" />
              {t("common.add")}
            </Button>
            <Button
              type="button"
              variant="gold"
              className="flex-1"
              onClick={() => saveRanges.mutate()}
              disabled={saveRanges.isPending}
            >
              {saveRanges.isPending ? t("common.saving") : t("common.save")}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
