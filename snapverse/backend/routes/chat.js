import express from "express";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/conversations", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.userId }, { receiver: req.userId }]
    })
      .populate("sender", "name photo")
      .populate("receiver", "name photo")
      .sort({ createdAt: -1 });

    const seen = new Set();
    const conversations = [];

    for (const msg of messages) {
      const otherId = msg.sender._id.toString() === req.userId
        ? msg.receiver._id.toString()
        : msg.sender._id.toString();

      if (!seen.has(otherId)) {
        seen.add(otherId);
        conversations.push({
          user: msg.sender._id.toString() === req.userId ? msg.receiver : msg.sender,
          lastMessage: msg,
          unread: !msg.isRead && msg.receiver._id.toString() === req.userId ? 1 : 0
        });
      }
    }

    res.json({ conversations });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.userId, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.userId }
      ]
    })
      .populate("sender", "name photo")
      .sort({ createdAt: 1 })
      .limit(100);

    await Message.updateMany(
      { sender: req.params.userId, receiver: req.userId, isRead: false },
      { isRead: true }
    );

    res.json({ messages });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { receiver, text, media, isSnap } = req.body;

    const message = await Message.create({
      sender: req.userId,
      receiver,
      text,
      media,
      isSnap: isSnap || false
    });

    const populated = await message.populate("sender", "name photo");
    res.status(201).json({ message: populated });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/:id/read", authMiddleware, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json({ message: msg });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/snap/unopened", authMiddleware, async (req, res) => {
  try {
    const snaps = await Message.find({
      receiver: req.userId,
      isSnap: true,
      snapOpened: false
    }).populate("sender", "name photo");

    res.json({ snaps });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/snap/:id/open", authMiddleware, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(
      req.params.id,
      { snapOpened: true, isRead: true },
      { new: true }
    );

    setTimeout(async () => {
      await Message.findByIdAndDelete(req.params.id);
    }, 5000);

    res.json({ message: msg });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
