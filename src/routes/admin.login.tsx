import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { ThemeToggle } from "@/components/store/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, Field, TextInput } from "@/components/admin/ui";
import { useI18n } from "@/lib/i18n";
import { getSession, login } from "@/server/auth";

export const Route = createFileRoute("/admin/login")({
  beforeLoad: async () => {
    const session = await getSession();
    if (session.authenticated) throw redirect({ to: "/admin" });
  },
  head: () => ({ meta: [{ title: "Admin · Safa" }, { name: "robots", content: "noindex" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const { t, lang, toggle } = useI18n();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const result = await login({ data: { password } });
      if (!result.ok) {
        setError(t("admin.login.invalid"));
        return;
      }
      await navigate({ to: "/admin" });
    } catch {
      setError(t("common.error"));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="gold-text font-sans text-2xl font-semibold">الصفا المروة</div>
          <h1 className="mt-2 text-lg font-semibold">{t("admin.login.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("admin.login.subtitle")}</p>
        </div>
        <div className="mb-4 flex justify-end">
          <ThemeToggle />
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label={t("admin.login.password")}>
            <TextInput
              type="password"
              autoComplete="current-password"
              autoFocus
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </Field>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" variant="gold" className="w-full" disabled={pending}>
            {pending ? t("common.loading") : t("admin.login.submit")}
          </Button>
          <button
            type="button"
            onClick={toggle}
            className="mx-auto block text-xs text-muted-foreground hover:text-gold"
          >
            {lang === "ar" ? "English" : "العربية"}
          </button>
        </form>
      </Card>
    </div>
  );
}
