import { createFileRoute } from "@tanstack/react-router";

import { saveUploadedImage } from "@/server/uploads";

export const Route = createFileRoute("/api/admin/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { isAdmin } = await import("@/server/session.server");
        if (!isAdmin()) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const form = await request.formData();
        const file = form.get("file");
        if (!(file instanceof File)) {
          return Response.json({ error: "No file received." }, { status: 400 });
        }
        try {
          const url = await saveUploadedImage(file);
          return Response.json({ url });
        } catch (error) {
          return Response.json(
            { error: error instanceof Error ? error.message : "Upload failed." },
            { status: 400 },
          );
        }
      },
    },
  },
});
