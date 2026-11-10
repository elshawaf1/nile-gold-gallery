import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import {
  Coins,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Package,
  Settings,
  Tags,
} from "lucide-react";

import { ThemeToggle } from "@/components/store/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { getSession, logout } from "@/server/auth";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/admin/login") return;
    const session = await getSession();
    if (!session.authenticated) throw redirect({ to: "/admin/login" });
  },
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", key: "admin.nav.dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", key: "admin.nav.products", icon: Package, exact: false },
  { to: "/admin/categories", key: "admin.nav.categories", icon: Tags, exact: false },
  { to: "/admin/prices", key: "admin.nav.prices", icon: Coins, exact: false },
  { to: "/admin/orders", key: "admin.nav.orders", icon: MessageCircle, exact: false },
  { to: "/admin/settings", key: "admin.nav.settings", icon: Settings, exact: false },
] as const;

function AdminLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { t, lang, toggle } = useI18n();
  const navigate = useNavigate();

  if (pathname === "/admin/login") return <Outlet />;

  async function signOut() {
    await logout();
    await navigate({ to: "/admin/login" });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/admin" className="flex items-baseline gap-2">
            <span className="gold-text font-sans text-lg font-semibold">{t("admin.title")}</span>
            <span className="hidden text-xs text-muted-foreground sm:inline">Safa Admin</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={toggle}
              className="rounded-full border border-border px-3 py-1 text-xs font-medium transition-colors hover:border-gold hover:text-gold"
            >
              {lang === "ar" ? "EN" : "عربي"}
            </button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/">{t("admin.nav.site")}</Link>
            </Button>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="size-4" />
              <span className="hidden sm:inline">{t("admin.logout")}</span>
            </Button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 pb-2">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-gold/15 text-gold-strong"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <item.icon className="size-4" />
                {t(item.key)}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
