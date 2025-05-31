// const express = require("express");
// const { createServer } = require("http");
// const { Server } = require("socket.io");
// const next = require("next");

// const dev = process.env.NODE_ENV !== "production";
// const app = next({ dev });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   const server = express();
//   const httpServer = createServer(server);

//   const io = new Server(httpServer, {
//     cors: {
//       origin: "*", // change this for production
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log("Client connected:", socket.id);

//     socket.on("message", (data) => {
//       console.log("Message received:", data);
//       // Echo back
//       socket.emit("message", `Server received: ${data}`);
//     });

//     socket.on("disconnect", () => {
//       console.log("Client disconnected:", socket.id);
//     });
//   });

//   server.all("*", (req, res) => handle(req, res));

//   const PORT = 3000;
//   httpServer.listen(PORT, () => {
//     console.log(`> Ready on http://localhost:${PORT}`);
//   });
// });

// // "dev": "next dev",

// const { createServer } = require("http");
// const { parse } = require("url");
// const { connectDB } = require("./lib/db");
import dotenv from "dotenv";
import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { connectDB } from "./lib/db.js";
import { Server as SocketIOServer } from "socket.io";
import { setupSocket } from "./lib/socket.js"; // <-- import socket logic

dotenv.config();

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  connectDB().catch(console.error);

  const io = new SocketIOServer(server, {
    cors: {
      origin: "*", // TODO: restrict this in production
    },
  });

  setupSocket(io); // <-- use your socket handler

  server.listen(port, () => {
    console.log(
      `> Server listening at http://localhost:${port} as ${
        dev ? "development" : process.env.NODE_ENV
      }`
    );
  });
});
