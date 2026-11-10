import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

import serverEntry from "../dist/server/server.js";

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? "0.0.0.0";
const CLIENT_DIR = join(process.cwd(), "dist", "client");

const TYPES = {
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

function staticFile(pathname) {
  const safe = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  const file = join(CLIENT_DIR, safe);
  if (!file.startsWith(CLIENT_DIR)) return null;
  if (!existsSync(file) || !statSync(file).isFile()) return null;
  return file;
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
    const file = staticFile(decodeURIComponent(url.pathname));

    if (file) {
      res.writeHead(200, {
        "content-type": TYPES[extname(file)] ?? "application/octet-stream",
        "cache-control": "public, max-age=31536000, immutable",
      });
      createReadStream(file).pipe(res);
      return;
    }

    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (Array.isArray(value)) value.forEach((item) => headers.append(key, item));
      else if (value) headers.set(key, value);
    }

    const method = req.method ?? "GET";
    const hasBody = method !== "GET" && method !== "HEAD";
    const request = new Request(url, {
      method,
      headers,
      ...(hasBody ? { body: req, duplex: "half" } : {}),
    });

    const response = await serverEntry.fetch(request, {}, {});
    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") return;
      res.setHeader(key, value);
    });
    const cookies = response.headers.getSetCookie?.() ?? [];
    if (cookies.length) res.setHeader("set-cookie", cookies);

    if (response.body) {
      const buffer = Buffer.from(await response.arrayBuffer());
      res.end(buffer);
    } else {
      res.end();
    }
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
});

server.listen(PORT, HOST, () => {
  console.log(`[safa] listening on http://${HOST}:${PORT}`);
});
