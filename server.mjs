import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";

const root = resolve(".");
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html;charset=utf-8",
  ".css": "text/css;charset=utf-8",
  ".js": "text/javascript;charset=utf-8",
  ".svg": "image/svg+xml;charset=utf-8",
  ".mp4": "video/mp4",
  ".ttf": "font/ttf",
  ".mp3": "audio/mpeg",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg"
};

createServer(async (request, response) => {
  try {
    let pathname = decodeURIComponent((request.url || "/").split("?")[0]);
    if (pathname === "/") pathname = "/index.html";

    const file = resolve(join(root, pathname));
    if (!file.startsWith(root)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    const data = await readFile(file);
    response.writeHead(200, {
      "Content-Type": types[extname(file)] || "application/octet-stream",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
    });
    response.end(data);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Xứ Sở Mầm Xanh đang chạy tại http://127.0.0.1:${port}`);
});
