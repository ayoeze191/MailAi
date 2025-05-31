import jwt from "jsonwebtoken";

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
    socket.on("message", (data) => {
      console.log(`📩 Message from ${socket.user.id}:`, data);
      socket.emit("message", `Server received: ${data}`);
    });

    socket.on("disconnect", () => {
      console.log(`👋 Disconnected: ${socket.id}`);
    });
  });
}
