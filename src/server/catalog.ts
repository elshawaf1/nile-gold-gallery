import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { CatalogData } from "@/lib/catalog-types";
import type { Product } from "@/lib/products";

export const getCatalog = createServerFn({ method: "GET" }).handler(
  async (): Promise<CatalogData> => {
    const { readCatalog } = await import("./catalog.server");
    return readCatalog();
  },
);

export const getProductById = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }): Promise<Product | null> => {
    const { readProductById } = await import("./catalog.server");
    return readProductById(data.id);
  });
