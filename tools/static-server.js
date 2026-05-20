const fs = require("fs");
const http = require("http");
const path = require("path");

const root = path.resolve(__dirname, "..");
const port = Number(process.env.PORT || 8000);

http.createServer((req, res) => {
  const requested = decodeURIComponent((req.url || "/").split("?")[0]);
  const safePath = requested === "/" ? "index.html" : requested.replace(/^\/+/, "");
  const fullPath = path.resolve(root, safePath);

  if (!fullPath.startsWith(root)) {
    res.statusCode = 403;
    res.end("forbidden");
    return;
  }

  fs.readFile(fullPath, (error, data) => {
    if (error) {
      res.statusCode = 404;
      res.end("not found");
      return;
    }
    const ext = path.extname(fullPath).toLowerCase();
    const types = {
      ".html": "text/html; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".js": "application/javascript; charset=utf-8",
      ".svg": "image/svg+xml; charset=utf-8",
    };
    res.setHeader("Content-Type", types[ext] || "application/octet-stream");
    res.end(data);
  });
}).listen(port, "127.0.0.1");
