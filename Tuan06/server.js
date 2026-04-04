const http = require("http");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      message: "Node.js app is running in Docker",
      method: req.method,
      path: req.url,
    }),
  );
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
