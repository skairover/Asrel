import "dotenv/config";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import auth from "./middleware/auth.js";

import socketHandler from "./socket.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import conversationRoutes from "./routes/conversations.js";
import messageRoutes from "./routes/messages.js";


const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("Server running");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

socketHandler(io);
app.set("io", io);

connectDB()
  .then(() => {
    server.listen(process.env.PORT || 5000, () => {
      console.log("Server started");
    });
  })
  .catch((err) => {
    console.error(err);
  });