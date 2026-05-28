import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import feedRoutes from "./routes/feed.js";
import snapRoutes from "./routes/snap.js";
import chatRoutes from "./routes/chat.js";
import mapRoutes from "./routes/map.js";
import { authMiddleware } from "./middleware/auth.js";
import Message from "./models/Message.js";

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/snap", snapRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/map", mapRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", system: "Snapverse" });
});

const onlineUsers = new Map();

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("No auth"));

  try {
    const jwt = await import("jsonwebtoken");
    const decoded = jwt.default.verify(token, process.env.JWT_SECRET || "snapverse_jwt_secret_key");
    socket.userId = decoded.id;
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  onlineUsers.set(socket.userId, socket.id);
  io.emit("online-users", Array.from(onlineUsers.keys()));

  socket.on("send-message", async (data) => {
    const { receiver, text, media, isSnap } = data;

    const message = await Message.create({
      sender: socket.userId,
      receiver,
      text,
      media,
      isSnap: isSnap || false
    });

    const populated = await message.populate("sender", "name photo");

    const receiverSocket = onlineUsers.get(receiver);
    if (receiverSocket) {
      io.to(receiverSocket).emit("new-message", populated);
    }

    socket.emit("message-sent", populated);
  });

  socket.on("typing", ({ receiver }) => {
    const receiverSocket = onlineUsers.get(receiver);
    if (receiverSocket) {
      io.to(receiverSocket).emit("user-typing", { userId: socket.userId });
    }
  });

  socket.on("stop-typing", ({ receiver }) => {
    const receiverSocket = onlineUsers.get(receiver);
    if (receiverSocket) {
      io.to(receiverSocket).emit("user-stop-typing", { userId: socket.userId });
    }
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(socket.userId);
    io.emit("online-users", Array.from(onlineUsers.keys()));
  });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`[Snapverse] Server running on port ${PORT}`);
  });
});
