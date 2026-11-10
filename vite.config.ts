import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
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
    }),
    viteReact(),
  ],
});
