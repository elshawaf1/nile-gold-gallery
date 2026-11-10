import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState, NativeSelect, PageHeader } from "@/components/admin/ui";
import { useI18n } from "@/lib/i18n";
import { formatEGP } from "@/lib/shop";
import {
  adminDeleteEnquiry,
  adminListEnquiries,
  adminUpdateEnquiry,
  type Enquiry,
} from "@/server/admin";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({
    meta: [{ title: "Enquiries · Safa Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: OrdersPage,
});

const STATUSES: Enquiry["status"][] = ["new", "contacted", "done"];

function OrdersPage() {
  const { t, lang } = useI18n();
  const queryClient = useQueryClient();
  const orders = useQuery({
    queryKey: ["admin", "enquiries"],
    queryFn: () => adminListEnquiries(),
  });

  async function refresh() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["admin", "enquiries"] }),
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] }),
    ]);
  }

  const update = useMutation({
    mutationFn: (input: { id: number; status: Enquiry["status"] }) =>
      adminUpdateEnquiry({ data: input }),
    onSuccess: refresh,
  });

  const remove = useMutation({
    mutationFn: (id: number) => adminDeleteEnquiry({ data: { id } }),
    onSuccess: refresh,
  });

  const statusLabel = (status: Enquiry["status"]) => t(`admin.orders.status.${status}`);

  return (
    <div>
      <PageHeader title={t("admin.orders.title")} />

      {orders.isLoading ? (
        <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
      ) : !orders.data || orders.data.length === 0 ? (
        <EmptyState>{t("admin.orders.empty")}</EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-3 text-start">{t("admin.orders.date")}</th>
                <th className="p-3 text-start">{t("admin.orders.product")}</th>
                <th className="p-3 text-start">{t("admin.products.karat")}</th>
                <th className="p-3 text-start">{t("admin.orders.source")}</th>
                <th className="p-3 text-start">{t("admin.orders.status")}</th>
                <th className="p-3 text-end">{t("admin.products.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {orders.data.map((order) => (
                <tr key={order.id} className="border-t border-border/70 align-top">
                  <td className="whitespace-nowrap p-3 text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString(lang === "ar" ? "ar-EG" : "en-GB")}
                  </td>
                  <td className="p-3">
                    <div className="font-medium">{order.productTitle || "—"}</div>
                    <div className="text-xs text-muted-foreground">
                      {order.karat} · {order.weight}g · {formatEGP(order.price)}
                    </div>
                    {(order.name || order.phone) && (
                      <div className="text-xs text-muted-foreground">
                        {[order.name, order.phone].filter(Boolean).join(" · ")}
                      </div>
                    )}
                  </td>
                  <td className="p-3">{order.karat}</td>
                  <td className="p-3 text-xs text-muted-foreground">{order.source}</td>
                  <td className="p-3">
                    <NativeSelect
                      value={order.status}
                      className="h-8 w-32 text-xs"
                      onChange={(event) =>
                        update.mutate({
                          id: order.id,
                          status: event.target.value as Enquiry["status"],
                        })
                      }
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {statusLabel(status)}
                        </option>
                      ))}
                    </NativeSelect>
                  </td>
                  <td className="p-3 text-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={t("common.delete")}
                      disabled={remove.isPending}
                      onClick={() => {
                        if (window.confirm(t("admin.orders.deleteConfirm")))
                          remove.mutate(order.id);
                      }}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
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
