import express from "express";
import jwt from "jsonwebtoken";
import { User, Message } from "../config/db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "snapverse_jwt_secret";

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return res.status(401).json({ msg: "No token" });
  try {
    req.userId = jwt.verify(header.split(" ")[1], JWT_SECRET).id;
    next();
  } catch { res.status(401).json({ msg: "Invalid token" }); }
}

function populateUser(msg, field) {
  if (typeof msg[field] === "string") {
    const u = db.users.find((x) => x.id === msg[field]);
    if (u) msg[field] = { id: u.id, name: u.name, photo: u.photo };
  }
  return msg;
}

router.get("/", auth, async (req, res) => {
  try {
    const allUsers = await User.find();
    const users = allUsers.filter((u) => (u.id || u._id) !== req.userId).map((u) => ({ id: u.id || u._id, name: u.name, email: u.email, photo: u.photo, online: u.online, lastSeen: u.lastSeen }));
    res.json({ users });
  } catch (err) { res.status(500).json({ msg: "Server error" }); }
});

router.get("/search", auth, async (req, res) => {
  try {
    const q = (req.query.q || "").toLowerCase();
    const allUsers = await User.find();
    const users = allUsers.filter((u) => (u.id || u._id) !== req.userId && u.name.toLowerCase().includes(q)).map((u) => ({ id: u.id || u._id, name: u.name, email: u.email, photo: u.photo, online: u.online }));
    res.json({ users });
  } catch (err) { res.status(500).json({ msg: "Server error" }); }
});

router.get("/conversations", auth, async (req, res) => {
  try {
    const allMessages = await Message.find();
    const seen = new Set();
    const conversations = [];
    const sorted = allMessages.filter((m) => m.sender === req.userId || m.receiver === req.userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    for (const msg of sorted) {
      const otherId = msg.sender === req.userId ? msg.receiver : msg.sender;
      if (!seen.has(otherId)) {
        seen.add(otherId);
        const allUsers = await User.find();
        const otherUser = allUsers.find((u) => (u.id || u._id) === otherId);
        conversations.push({ user: otherUser ? { id: otherUser.id, name: otherUser.name, photo: otherUser.photo } : { id: otherId }, lastMessage: msg, unread: !msg.isRead && msg.receiver === req.userId ? 1 : 0 });
      }
    }
    res.json({ conversations });
  } catch (err) { res.status(500).json({ msg: "Server error" }); }
});

router.get("/messages/:userId", auth, async (req, res) => {
  try {
    const allMessages = await Message.find();
    const messages = allMessages.filter((m) => (m.sender === req.userId && m.receiver === req.params.userId) || (m.sender === req.params.userId && m.receiver === req.userId)).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).slice(0, 100);
    await Message.updateMany({ sender: req.params.userId, receiver: req.userId, isRead: false }, { isRead: true });
    const allUsers = await User.find();
    const populated = messages.map((m) => {
      const sender = allUsers.find((u) => (u.id || u._id) === m.sender);
      return { ...m, sender: sender ? { id: sender.id, name: sender.name, photo: sender.photo } : { id: m.sender } };
    });
    res.json({ messages: populated });
  } catch (err) { res.status(500).json({ msg: "Server error" }); }
});

export default router;
