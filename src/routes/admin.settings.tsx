import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, Field, PageHeader, TextInput } from "@/components/admin/ui";
import { useI18n } from "@/lib/i18n";
import type { ShopSettings } from "@/lib/catalog-types";
import { adminGetSettings, adminSaveSettings } from "@/server/admin";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [{ title: "Settings · Safa Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const settings = useQuery({ queryKey: ["admin", "settings"], queryFn: () => adminGetSettings() });
  const [form, setForm] = useState<ShopSettings | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (settings.data) setForm(settings.data);
  }, [settings.data]);

  const save = useMutation({
    mutationFn: (data: ShopSettings) => adminSaveSettings({ data }),
    onSuccess: async () => {
      setSaved(true);
      setError(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["catalog"] }),
        queryClient.invalidateQueries({ queryKey: ["admin", "settings"] }),
      ]);
      window.setTimeout(() => setSaved(false), 2000);
    },
    onError: () => setError(t("common.error")),
  });

  if (!form) {
    return (
      <div>
        <PageHeader title={t("admin.settings.title")} />
        <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  function set<K extends keyof ShopSettings>(key: K, value: ShopSettings[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  return (
    <div>
      <PageHeader
        title={t("admin.settings.title")}
        actions={
          <div className="flex items-center gap-3">
            {saved && <span className="text-sm text-emerald-500">{t("common.saved")}</span>}
            <Button
              variant="gold"
              size="sm"
              onClick={() => save.mutate(form)}
              disabled={save.isPending}
            >
              {save.isPending ? t("common.saving") : t("common.save")}
            </Button>
          </div>
        }
      />

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      <Card className="grid gap-4 sm:grid-cols-2">
        <Field label={t("admin.settings.nameEn")}>
          <TextInput value={form.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label={t("admin.settings.nameAr")}>
          <TextInput
            dir="rtl"
            value={form.nameAr}
            onChange={(e) => set("nameAr", e.target.value)}
          />
        </Field>
        <Field label={t("admin.settings.taglineEn")}>
          <TextInput value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
        </Field>
        <Field label={t("admin.settings.taglineAr")}>
          <TextInput
            dir="rtl"
            value={form.taglineAr}
            onChange={(e) => set("taglineAr", e.target.value)}
          />
        </Field>
        <Field label={t("admin.settings.phone")}>
          <TextInput value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field label={t("admin.settings.whatsapp")} hint="201000000000">
          <TextInput value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
        </Field>
        <Field label={t("admin.settings.addressEn")}>
          <TextInput value={form.address} onChange={(e) => set("address", e.target.value)} />
        </Field>
        <Field label={t("admin.settings.addressAr")}>
          <TextInput
            dir="rtl"
            value={form.addressAr}
            onChange={(e) => set("addressAr", e.target.value)}
          />
        </Field>
        <Field label={t("admin.settings.hoursEn")}>
          <TextInput value={form.hours} onChange={(e) => set("hours", e.target.value)} />
        </Field>
        <Field label={t("admin.settings.hoursAr")}>
          <TextInput
            dir="rtl"
            value={form.hoursAr}
            onChange={(e) => set("hoursAr", e.target.value)}
          />
        </Field>
      </Card>
    </div>
  );
}
