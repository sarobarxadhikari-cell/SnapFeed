import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { setupSocket } from "./socket.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.json({ status: "ok", system: "Snapverse-Pro" });
});

const server = http.createServer(app);
setupSocket(server);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`[Snapverse-Pro] Server running on port ${PORT}`);
  });
});
