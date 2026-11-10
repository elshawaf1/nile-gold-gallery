import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const login = createServerFn({ method: "POST" })
  .validator(z.object({ password: z.string().min(1) }))
  .handler(async ({ data }): Promise<{ ok: boolean; error?: string }> => {
    const { attemptLogin } = await import("./session.server");
    return attemptLogin(data.password);
  });

export const logout = createServerFn({ method: "POST" }).handler(
  async (): Promise<{ ok: true }> => {
    const { clearSession } = await import("./session.server");
    clearSession();
    return { ok: true };
  },
);

export const getSession = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ authenticated: boolean }> => {
    const { isAdmin } = await import("./session.server");
    return { authenticated: isAdmin() };
  },
);
