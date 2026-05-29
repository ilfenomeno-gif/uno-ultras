import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT || 4173);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav"
};

function resolveRequest(urlPath) {
  const clean = decodeURIComponent((urlPath || "/").split("?")[0]);
  const target = clean === "/" ? "/index.html" : clean;
  return path.normalize(path.join(root, target));
}

createServer((req, res) => {
  const resolved = resolveRequest(req.url || "/");
  if (!resolved.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  let filePath = resolved;
  if (!existsSync(filePath)) {
    filePath = path.join(root, "index.html");
  }
  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }
  if (!existsSync(filePath)) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
  createReadStream(filePath).pipe(res);
}).listen(port, () => {
  console.log(`UNO Ultra v2 dev server running at http://localhost:${port}`);
});
