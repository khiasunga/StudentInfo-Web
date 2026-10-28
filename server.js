const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

const server = http.createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end();
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  } catch {
    response.writeHead(400);
    response.end("Bad request");
    return;
  }

  const relativePath = pathname === "/" ? "Index.html" : pathname.slice(1);
  const filePath = path.resolve(root, relativePath);
  const isFrontendFile =
    relativePath === "Index.html" ||
    relativePath.startsWith(`assets${path.sep}css${path.sep}`) ||
    relativePath.startsWith(`assets${path.sep}js${path.sep}`);

  if (
    !isFrontendFile ||
    relativePath.includes("\\") ||
    path.relative(root, filePath).startsWith("..")
  ) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream",
      "Content-Length": stats.size,
    });

    if (request.method === "HEAD") {
      response.end();
      return;
    }

    fs.createReadStream(filePath).pipe(response);
  });
});

const port = Number(process.env.PORT) || 3000;
server.listen(port, "0.0.0.0", () => {
  console.log(`StudentInfo-Web listening on port ${port}`);
});
