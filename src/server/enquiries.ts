import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const trackEnquiry = createServerFn({ method: "POST" })
  .validator(
    z.object({
      productId: z.string().optional(),
      productTitle: z.string().min(1),
      karat: z.string().min(1),
      weight: z.number().nonnegative(),
      price: z.number().nonnegative(),
      source: z.enum(["product_card", "quick_view", "product_page"]),
      name: z.string().trim().max(120).optional(),
      phone: z.string().trim().max(40).optional(),
      note: z.string().trim().max(1000).optional(),
    }),
  )
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const { recordEnquiry } = await import("./enquiries.server");
    recordEnquiry(data);
    return { ok: true };
  });
