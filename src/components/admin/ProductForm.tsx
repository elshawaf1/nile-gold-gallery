import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  Field,
  NativeSelect,
  PageHeader,
  TextArea,
  TextInput,
  Toggle,
} from "@/components/admin/ui";
import { useI18n } from "@/lib/i18n";
import { adminListCategories, adminSaveProduct, type AdminProduct } from "@/server/admin";

type FormState = {
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  category: string;
  karat: "24K" | "21K" | "18K";
  weight: string;
  making: string;
  rating: string;
  reviews: string;
  image: string;
  inStock: boolean;
  active: boolean;
  sortOrder: string;
};

function initialState(product?: AdminProduct): FormState {
  return {
    titleEn: product?.title ?? "",
    titleAr: product?.titleAr ?? "",
    descriptionEn: product?.description ?? "",
    descriptionAr: product?.descriptionAr ?? "",
    category: product?.category ?? "",
    karat: product?.karat ?? "21K",
    weight: product ? String(product.weight) : "",
    making: product ? String(product.making) : "0",
    rating: product ? String(product.rating) : "5",
    reviews: product ? String(product.reviews) : "0",
    image: product?.image ?? "",
    inStock: product?.inStock ?? true,
    active: product?.active ?? true,
    sortOrder: product ? String(product.sortOrder) : "0",
  };
}

export function ProductForm({ product }: { product?: AdminProduct }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(() => initialState(product));
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const categories = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: () => adminListCategories(),
  });

  const save = useMutation({
    mutationFn: () =>
      adminSaveProduct({
        data: {
          ...(product ? { id: product.id } : {}),
          titleEn: form.titleEn,
          titleAr: form.titleAr,
          descriptionEn: form.descriptionEn,
          descriptionAr: form.descriptionAr,
          category: form.category,
          karat: form.karat,
          weight: Number(form.weight),
          making: Number(form.making),
          rating: Number(form.rating),
          reviews: Math.round(Number(form.reviews)),
          image: form.image,
          inStock: form.inStock,
          active: form.active,
          sortOrder: Math.round(Number(form.sortOrder)),
        },
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["catalog"] }),
        queryClient.invalidateQueries({ queryKey: ["admin", "products"] }),
        queryClient.invalidateQueries({ queryKey: ["admin", "stats"] }),
      ]);
      await navigate({ to: "/admin/products" });
    },
    onError: () => setError(t("common.error")),
  });

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function upload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const payload = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !payload.url) throw new Error(payload.error ?? "Upload failed");
      set("image", payload.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : t("common.error"));
    } finally {
      setUploading(false);
    }
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!form.category) {
      setError(t("admin.products.category"));
      return;
    }
    if (!(Number(form.weight) > 0)) {
      setError(t("admin.products.weight"));
      return;
    }
    save.mutate();
  }

  return (
    <form onSubmit={onSubmit}>
      <PageHeader
        title={product ? t("admin.products.editTitle") : t("admin.products.newTitle")}
        actions={
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: "/admin/products" })}
            >
              {t("admin.products.back")}
            </Button>
            <Button type="submit" variant="gold" size="sm" disabled={save.isPending}>
              {save.isPending ? t("common.saving") : t("common.save")}
            </Button>
          </>
        }
      />

      {error && (
        <p className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <Card className="grid gap-4 sm:grid-cols-2">
            <Field label={t("admin.products.nameEn")}>
              <TextInput
                value={form.titleEn}
                onChange={(e) => set("titleEn", e.target.value)}
                required
              />
            </Field>
            <Field label={t("admin.products.nameAr")}>
              <TextInput
                dir="rtl"
                value={form.titleAr}
                onChange={(e) => set("titleAr", e.target.value)}
                required
              />
            </Field>
            <Field label={t("admin.products.descEn")}>
              <TextArea
                value={form.descriptionEn}
                onChange={(e) => set("descriptionEn", e.target.value)}
              />
            </Field>
            <Field label={t("admin.products.descAr")}>
              <TextArea
                dir="rtl"
                value={form.descriptionAr}
                onChange={(e) => set("descriptionAr", e.target.value)}
              />
            </Field>
          </Card>

          <Card className="grid gap-4 sm:grid-cols-2">
            <Field label={t("admin.products.category")}>
              <NativeSelect
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                required
              >
                <option value="">—</option>
                {(categories.data ?? []).map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.labelEn} · {category.labelAr}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label={t("admin.products.karat")}>
              <NativeSelect
                value={form.karat}
                onChange={(e) => set("karat", e.target.value as FormState["karat"])}
              >
                <option value="24K">24K</option>
                <option value="21K">21K</option>
                <option value="18K">18K</option>
              </NativeSelect>
            </Field>
            <Field label={t("admin.products.weight")}>
              <TextInput
                type="number"
                min="0.01"
                step="0.01"
                value={form.weight}
                onChange={(e) => set("weight", e.target.value)}
                required
              />
            </Field>
            <Field label={t("admin.products.making")}>
              <TextInput
                type="number"
                min="0"
                step="1"
                value={form.making}
                onChange={(e) => set("making", e.target.value)}
              />
            </Field>
            <Field label={t("admin.products.rating")}>
              <TextInput
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={(e) => set("rating", e.target.value)}
              />
            </Field>
            <Field label={t("admin.products.reviews")}>
              <TextInput
                type="number"
                min="0"
                step="1"
                value={form.reviews}
                onChange={(e) => set("reviews", e.target.value)}
              />
            </Field>
            <Field label={t("admin.products.sort")}>
              <TextInput
                type="number"
                step="1"
                value={form.sortOrder}
                onChange={(e) => set("sortOrder", e.target.value)}
              />
            </Field>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="space-y-3">
            <Field label={t("admin.products.image")}>
              <TextInput
                value={form.image}
                onChange={(e) => set("image", e.target.value)}
                placeholder="/api/uploads/..."
              />
            </Field>
            <div className="aspect-square overflow-hidden rounded-lg border border-border bg-muted/30">
              {form.image ? (
                <img src={form.image} alt="" className="size-full object-contain" />
              ) : (
                <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                  {t("admin.products.image")}
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void upload(file);
                e.target.value = "";
              }}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="size-4" />
              {uploading ? t("common.loading") : t("admin.products.upload")}
            </Button>
          </Card>

          <Card className="space-y-3">
            <Toggle
              checked={form.inStock}
              onChange={(value) => set("inStock", value)}
              label={t("admin.products.inStock")}
            />
            <Toggle
              checked={form.active}
              onChange={(value) => set("active", value)}
              label={t("admin.products.active")}
            />
          </Card>
        </div>
      </div>
    </form>
  );
}
