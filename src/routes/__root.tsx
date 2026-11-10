import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { SiteFooter } from "@/components/store/SiteFooter";
import { SiteHeader } from "@/components/store/SiteHeader";
import { Toaster } from "@/components/ui/sonner";
import { CatalogProvider } from "@/lib/catalog";
import type { CatalogData } from "@/lib/catalog-types";
import { getCatalog } from "@/server/catalog";
import { getGoldRates, type GoldRatePayload } from "@/lib/gold-api";
import { GoldRatesProvider } from "@/lib/gold-rates";
import { STATIC_DEMO, STATIC_DEMO_CATALOG, STATIC_DEMO_RATES } from "@/lib/static-demo";
import { THEME_INIT_SCRIPT, ThemeProvider } from "@/lib/theme";
import { I18nProvider } from "@/lib/i18n";
import { WishlistProvider } from "@/lib/wishlist";
import { BackToTop } from "@/components/store/BackToTop";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 text-5xl font-bold text-gold-strong">404</h1>
        <h2 className="mt-3 text-xl font-semibold text-foreground">
          الصفحة غير موجودة · Page not found
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-gold-foreground transition hover:brightness-105"
          >
            الرئيسية · Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    // Surface the error locally; no third-party telemetry is attached.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          تعذر تحميل الصفحة · This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          حدث خطأ من جانبنا. جرّب تحديث الصفحة أو العودة للرئيسية.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-gold-foreground transition hover:brightness-105"
          >
            إعادة المحاولة · Try again
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            الرئيسية · Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: async ({ context }) => {
    if (STATIC_DEMO) {
      return { catalog: STATIC_DEMO_CATALOG, goldRates: STATIC_DEMO_RATES };
    }

    const [catalog, goldRates] = await Promise.all([
      context.queryClient.ensureQueryData({
        queryKey: ["catalog"],
        queryFn: () => getCatalog(),
      }),
      context.queryClient.ensureQueryData({
        queryKey: ["gold-rates"],
        queryFn: () => getGoldRates(),
        staleTime: 5 * 60 * 1000,
      }),
    ]);
    return { catalog, goldRates };
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "الصفا المروة — Al-Safa Al-Marwa | Gold Jewelry in Dakahlia" },
      {
        name: "description",
        content:
          "مجوهرات ذهب عيار ١٨ و٢١ و٢٤ من الصفا المروة، دكرنس، الدقهلية. أسعار محدثة بسعر الذهب اليوم.",
      },
      { property: "og:title", content: "الصفا المروة | Al-Safa Al-Marwa" },
      { property: "og:description", content: "Gold jewelry store in Dekernes, Dakahlia, Egypt." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&family=Manrope:wght@300;400;500;600&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: `${import.meta.env.BASE_URL}favicon.svg`, type: "image/svg+xml" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootChrome() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Outlet />
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="flex-1">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>
        <SiteFooter />
      </div>
      <BackToTop />
    </>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const { catalog, goldRates } = Route.useLoaderData() as {
    catalog: CatalogData;
    goldRates: GoldRatePayload;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <ThemeProvider>
          <CatalogProvider initialCatalog={catalog}>
            <GoldRatesProvider initialRates={goldRates}>
              <WishlistProvider>
                <RootChrome />
                <Toaster position="top-center" />
              </WishlistProvider>
            </GoldRatesProvider>
          </CatalogProvider>
        </ThemeProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}
