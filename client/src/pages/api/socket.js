import { Server } from "socket.io";
import jwt from "jsonwebtoken";

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("Starting Socket.IO server...");

    const io = new Server(res.socket.server, {
      path: "/api/socket_io",
    });
    io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);

    socket.user = user;

    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  console.log(
    `User ${socket.user.userId} connected (${socket.id})`
  );

  // personal room
  socket.join(`user:${socket.user.userId}`);

  socket.on("join-conversation", (conversationId) => {
    socket.join(conversationId);

    console.log(
      `User ${socket.user.userId} joined conversation ${conversationId}`
    );
  });

  socket.on("send-message", (message) => {
    io.to(message.conversation).emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});
    res.socket.server.io = io;
    global.io = io;
  }

  res.end();
}