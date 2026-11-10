import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, Field, PageHeader, TextInput, Toggle } from "@/components/admin/ui";
import { useI18n } from "@/lib/i18n";
import { adminDeleteCategory, adminListCategories, adminSaveCategory } from "@/server/admin";
import type { Category } from "@/lib/catalog-types";

export const Route = createFileRoute("/admin/categories")({
  head: () => ({
    meta: [{ title: "Categories · Safa Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: CategoriesPage,
});

type Draft = {
  slug: string;
  labelEn: string;
  labelAr: string;
  sortOrder: string;
  active: boolean;
};

const EMPTY: Draft = { slug: "", labelEn: "", labelAr: "", sortOrder: "0", active: true };

function CategoriesPage() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const categories = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: () => adminListCategories(),
  });

  async function refresh() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] }),
      queryClient.invalidateQueries({ queryKey: ["catalog"] }),
    ]);
  }

  const save = useMutation({
    mutationFn: () =>
      adminSaveCategory({
        data: {
          slug: draft.slug.trim(),
          labelEn: draft.labelEn.trim(),
          labelAr: draft.labelAr.trim(),
          sortOrder: Math.round(Number(draft.sortOrder) || 0),
          active: draft.active,
        },
      }),
    onSuccess: async () => {
      await refresh();
      setDraft(EMPTY);
      setEditing(null);
      setError(null);
    },
    onError: () => setError(t("common.error")),
  });

  const remove = useMutation({
    mutationFn: (slug: string) => adminDeleteCategory({ data: { slug } }),
    onSuccess: refresh,
  });

  function edit(category: Category) {
    setEditing(category.slug);
    setDraft({
      slug: category.slug,
      labelEn: category.labelEn,
      labelAr: category.labelAr,
      sortOrder: String(category.sortOrder),
      active: category.active,
    });
  }

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div>
      <PageHeader title={t("admin.categories.title")} />

      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <Card>
          <h2 className="mb-3 font-semibold">
            {editing ? t("common.edit") : t("admin.categories.new")}
          </h2>
          {error && <p className="mb-2 text-sm text-destructive">{error}</p>}
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              if (!draft.slug.trim() || !draft.labelEn.trim() || !draft.labelAr.trim()) {
                setError(t("common.error"));
                return;
              }
              save.mutate();
            }}
          >
            <Field label={t("admin.categories.slug")}>
              <TextInput
                value={draft.slug}
                onChange={(e) => set("slug", e.target.value)}
                disabled={!!editing}
                placeholder="necklaces"
                required
              />
            </Field>
            <Field label={t("admin.categories.nameEn")}>
              <TextInput
                value={draft.labelEn}
                onChange={(e) => set("labelEn", e.target.value)}
                required
              />
            </Field>
            <Field label={t("admin.categories.nameAr")}>
              <TextInput
                dir="rtl"
                value={draft.labelAr}
                onChange={(e) => set("labelAr", e.target.value)}
                required
              />
            </Field>
            <Field label={t("admin.categories.sort")}>
              <TextInput
                type="number"
                step="1"
                value={draft.sortOrder}
                onChange={(e) => set("sortOrder", e.target.value)}
              />
            </Field>
            <Toggle
              checked={draft.active}
              onChange={(value) => set("active", value)}
              label={t("admin.categories.active")}
            />
            <div className="flex gap-2">
              <Button type="submit" variant="gold" className="flex-1" disabled={save.isPending}>
                <Plus className="size-4" />
                {save.isPending ? t("common.saving") : t("common.save")}
              </Button>
              {editing && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setEditing(null);
                    setDraft(EMPTY);
                    setError(null);
                  }}
                >
                  {t("common.cancel")}
                </Button>
              )}
            </div>
          </form>
        </Card>

        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="p-3 text-start">{t("admin.categories.slug")}</th>
                  <th className="p-3 text-start">{t("admin.categories.nameAr")}</th>
                  <th className="p-3 text-start">{t("admin.categories.nameEn")}</th>
                  <th className="p-3 text-start">{t("admin.categories.active")}</th>
                  <th className="p-3 text-end">{t("admin.products.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {(categories.data ?? []).map((category) => (
                  <tr key={category.slug} className="border-t border-border/70">
                    <td className="p-3 font-mono text-xs">{category.slug}</td>
                    <td className="p-3">{category.labelAr}</td>
                    <td className="p-3">{category.labelEn}</td>
                    <td className="p-3">{category.active ? "✓" : "—"}</td>
                    <td className="p-3">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => edit(category)}
                          aria-label={t("common.edit")}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={t("common.delete")}
                          disabled={remove.isPending}
                          onClick={() => {
                            if (
                              window.confirm(
                                `${t("admin.categories.deleteConfirm")}\n${category.slug}`,
                              )
                            ) {
                              remove.mutate(category.slug);
                            }
                          }}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
