// Serves dist/client the way Hostinger will: extensionless URLs map to the prerendered
// <route>/index.html, unknown paths get 404.html with a 404 status, nothing is server-rendered.
// Run `npm run build` first, then `npm run preview:static`.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve("dist/client");
const port = Number(process.env.PORT ?? 4173);

if (!existsSync(root)) {
  console.error("dist/client not found — run `npm run build` first.");
  process.exit(1);
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff2": "font/woff2",
};

async function isFile(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url, "http://localhost");
  let path = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, "");
  if (path.length > 1) path = path.replace(/[/\\]+$/, "");

  for (const file of [join(root, path), join(root, path, "index.html")]) {
    if (file.startsWith(root) && (await isFile(file))) {
      res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" });
      return res.end(await readFile(file));
    }
  }

  res.writeHead(404, { "content-type": MIME[".html"] });
  res.end(await readFile(join(root, "404.html")));
}).listen(port, () => {
  console.log(`Static build served at http://localhost:${port} (Ctrl+C to stop)`);
});
