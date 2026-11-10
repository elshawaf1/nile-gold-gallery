import { createFileRoute, notFound } from "@tanstack/react-router";

import { ProductForm } from "@/components/admin/ProductForm";
import { adminGetProduct } from "@/server/admin";

export const Route = createFileRoute("/admin/products/$id")({
  head: () => ({
    meta: [{ title: "Edit product · Safa Admin" }, { name: "robots", content: "noindex" }],
  }),
  loader: async ({ params }) => {
    const product = await adminGetProduct({ data: { id: params.id } });
    if (!product) throw notFound();
    return { product };
  },
  component: EditProduct,
});

function EditProduct() {
  const { product } = Route.useLoaderData();
  return <ProductForm product={product} />;
}
