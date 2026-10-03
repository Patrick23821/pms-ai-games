import http from "node:http";
import express from "express";
import { createBareServer } from "@mercuryworkshop/bare-server-node";

const app = express();
const bare = createBareServer("/bare/");
const PORT = process.env.PORT || 8080;

app.use(express.static("."));

const server = http.createServer();

server.on("request", (req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bare.shouldRoute(req)) {
    bare.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

server.listen(PORT, () => {
  console.log(`Tesseract server listening on port ${PORT}`);
});
