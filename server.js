import http from "http";
import handler from "./handler.js";

const server = http.createServer((req, res) => {

  handler(req, res);
  res.end();
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
