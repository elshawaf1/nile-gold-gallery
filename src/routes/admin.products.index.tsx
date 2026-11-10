import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader } from "@/components/admin/ui";
import { labelForCategory, useCatalog } from "@/lib/catalog";
import { useGoldRates } from "@/lib/gold-rates";
import { useI18n } from "@/lib/i18n";
import { priceOf } from "@/lib/products";
import { formatEGP } from "@/lib/shop";
import { adminDeleteProduct, adminListProducts } from "@/server/admin";

export const Route = createFileRoute("/admin/products/")({
  head: () => ({
    meta: [{ title: "Products · Safa Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { t, lang } = useI18n();
  const { rates } = useGoldRates();
  const { categories } = useCatalog();
  const queryClient = useQueryClient();
  const products = useQuery({
    queryKey: ["admin", "products"],
    queryFn: () => adminListProducts(),
  });

  const remove = useMutation({
    mutationFn: (id: string) => adminDeleteProduct({ data: { id } }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin", "products"] }),
        queryClient.invalidateQueries({ queryKey: ["admin", "stats"] }),
        queryClient.invalidateQueries({ queryKey: ["catalog"] }),
      ]);
    },
  });

  function onDelete(id: string, title: string) {
    if (window.confirm(`${t("admin.products.deleteConfirm")}\n${title}`)) remove.mutate(id);
  }

  return (
    <div>
      <PageHeader
        title={t("admin.products.title")}
        actions={
          <Button asChild variant="gold" size="sm">
            <Link to="/admin/products/new">
              <Plus className="size-4" />
              {t("admin.products.add")}
            </Link>
          </Button>
        }
      />

      {products.isLoading ? (
        <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
      ) : !products.data || products.data.length === 0 ? (
        <EmptyState>{t("admin.products.empty")}</EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-3 text-start">#</th>
                <th className="p-3 text-start">{t("admin.products.title")}</th>
                <th className="p-3 text-start">{t("admin.products.category")}</th>
                <th className="p-3 text-start">{t("admin.products.karat")}</th>
                <th className="p-3 text-start">{t("admin.products.weight")}</th>
                <th className="p-3 text-start">{t("admin.products.active")}</th>
                <th className="p-3 text-end">{t("admin.products.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {products.data.map((product) => (
                <tr key={product.id} className="border-t border-border/70">
                  <td className="p-3">
                    <img
                      src={product.image}
                      alt=""
                      className="size-10 rounded-md object-cover"
                      loading="lazy"
                    />
                  </td>
                  <td className="p-3">
                    <div className="font-medium">
                      {lang === "ar" ? product.titleAr : product.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatEGP(priceOf(product, rates))}
                    </div>
                  </td>
                  <td className="p-3">{labelForCategory(categories, product.category, lang)}</td>
                  <td className="p-3">{product.karat}</td>
                  <td className="p-3">{product.weight}</td>
                  <td className="p-3">
                    <span
                      className={
                        product.active
                          ? "rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-500"
                          : "rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                      }
                    >
                      {product.active ? "✓" : "—"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-1">
                      <Button asChild variant="ghost" size="icon" aria-label={t("common.edit")}>
                        <Link to="/admin/products/$id" params={{ id: product.id }}>
                          <Pencil className="size-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={t("common.delete")}
                        onClick={() => onDelete(product.id, product.title)}
                        disabled={remove.isPending}
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
      )}
    </div>
  );
}
