import jwt from "jsonwebtoken";

export default function socketHandler(io) {
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
    console.log(`User ${socket.user.userId} connected (${socket.id})`);

    // personal notification room
    socket.join(`user:${socket.user.userId}`);

    socket.on("join-conversation", (conversationId) => {
      socket.join(conversationId);

      console.log(`User ${socket.user.userId} joined ${conversationId}`);
    });


    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
    });
  });
}
