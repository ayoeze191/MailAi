import jwt from "jsonwebtoken";
import { askAI } from "./askAi.js";

export function setupSocket(io) {
  io.on("connection", (socket) => {
    const token = socket.handshake.query.token;

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = user;
      console.log(`🔐 Authenticated user: ${user.id}, socket: ${socket.id}`);
    } catch (err) {
      console.log("❌ Invalid token. Disconnecting...");
      socket.disconnect(true);
      return;
    }

    socket.on("message", async (userMessage) => {
      console.log(`📩 Message from ${socket.user.id}:`, userMessage);
      try {
        const aiReply = await askAI(userMessage);
        socket.emit("message", aiReply);
      } catch (err) {
        console.error("❌ AI request failed:", err);
        socket.emit("message", "Sorry, something went wrong.");
      }
    });

    socket.on("disconnect", () => {
      console.log(`👋 Disconnected: ${socket.id}`);
    });
  });
}
