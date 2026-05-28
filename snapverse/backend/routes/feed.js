import express from "express";
import Post from "../models/Post.js";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const friendIds = user.friends.map(f => f.toString());

    const posts = await Post.find({
      user: { $in: [req.userId, ...friendIds] }
    })
      .populate("user", "name photo")
      .populate("comments.user", "name photo")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ posts });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/explore", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({ user: { $ne: req.userId } })
      .populate("user", "name photo")
      .sort({ createdAt: -1 })
      .limit(30);

    res.json({ posts });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { text, image } = req.body;
    const post = await Post.create({ user: req.userId, text, image });

    const populated = await post.populate("user", "name photo");
    res.status(201).json({ post: populated });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/:id/like", authMiddleware, async (req, res) => {
  try {
    const { type } = req.body;
    const reactionType = type || "like";
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const existing = post.reactions.find(
      r => r.user.toString() === req.userId
    );

    if (existing) {
      if (existing.type === reactionType) {
        post.reactions = post.reactions.filter(
          r => r.user.toString() !== req.userId
        );
      } else {
        existing.type = reactionType;
      }
    } else {
      post.reactions.push({ user: req.userId, type: reactionType });
    }

    post.likes = post.reactions.filter(r => r.type === "like").map(r => r.user);
    await post.save();
    res.json({ reactions: post.reactions, likes: post.likes });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/:id/comment", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    post.comments.push({ user: req.userId, text });
    await post.save();

    const updated = await post.populate("comments.user", "name photo");
    res.json({ comments: updated.comments });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    if (post.user.toString() !== req.userId) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ msg: "Post deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
