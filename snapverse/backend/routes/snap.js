import express from "express";
import Story from "../models/Story.js";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/stories", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const friendIds = user.friends.map(f => f.toString());

    const stories = await Story.find({
      user: { $in: [req.userId, ...friendIds] },
      expiresAt: { $gt: new Date() }
    })
      .populate("user", "name photo")
      .sort({ createdAt: -1 });

    const grouped = {};
    for (const story of stories) {
      const uid = story.user._id.toString();
      if (!grouped[uid]) {
        grouped[uid] = { user: story.user, stories: [] };
      }
      grouped[uid].stories.push(story);
    }

    res.json({ groups: Object.values(grouped) });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/story", authMiddleware, async (req, res) => {
  try {
    const { media, caption } = req.body;
    const story = await Story.create({ user: req.userId, media, caption });

    const populated = await story.populate("user", "name photo");
    res.status(201).json({ story: populated });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/story/:id/view", authMiddleware, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ msg: "Story not found" });

    if (!story.viewers.includes(req.userId)) {
      story.viewers.push(req.userId);
      await story.save();
    }

    res.json({ viewers: story.viewers });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.delete("/story/:id", authMiddleware, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ msg: "Story not found" });
    if (story.user.toString() !== req.userId) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await Story.findByIdAndDelete(req.params.id);
    res.json({ msg: "Story deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/friends-location", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const friendIds = user.friends.map(f => f.toString());

    const friends = await User.find({ _id: { $in: friendIds } })
      .select("name photo location lastActive");

    res.json({ friends });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
