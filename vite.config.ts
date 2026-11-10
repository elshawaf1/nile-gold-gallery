import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

const isGitHubPages = process.env["GITHUB_PAGES"] === "true";
const pagesBase = isGitHubPages ? "/nile-gold-gallery/" : "/";

export default defineConfig({
  base: pagesBase,
  server: {
    // Allow access from the local network / preview environments.
    host: true,
  },
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart({
      // Use src/server.ts as the SSR entry (error wrapper around TanStack Start).
      server: { entry: "server" },
      router: { basepath: isGitHubPages ? "/nile-gold-gallery" : undefined },
      ...(isGitHubPages
        ? {
            prerender: {
              enabled: true,
              crawlLinks: true,
              autoStaticPathsDiscovery: true,
              filter: ({ path }: { path: string }) => !path.startsWith("/admin"),
            },
          }
        : {}),
    }),
    viteReact(),
  ],
});
