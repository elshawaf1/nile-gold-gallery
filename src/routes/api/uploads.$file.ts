import { readFileSync } from "node:fs";
import { basename, join } from "node:path";

import { createFileRoute } from "@tanstack/react-router";

import { UPLOAD_DIR } from "@/server/db";
import { contentTypeFor } from "@/server/uploads";

export const Route = createFileRoute("/api/uploads/$file")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const name = basename(params.file);
        if (!name) return new Response("Not found", { status: 404 });
        try {
          const data = readFileSync(join(UPLOAD_DIR, name));
          return new Response(data, {
            headers: {
              "content-type": contentTypeFor(name),
              "cache-control": "public, max-age=31536000, immutable",
            },
          });
        } catch {
          return new Response("Not found", { status: 404 });
        }
      },
    },
  },
});
