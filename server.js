import "dotenv/config";
import http from "http";
import handler from "./handler.js";

const port = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  handler(req, res);
  res.end();
});

test();
server.listen(port, () => {
  console.log("Server running on port: " + port);
});
