import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken, authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ msg: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        bio: user.bio,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "No account found with this email" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    user.lastActive = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        bio: user.bio,
        friends: user.friends,
        friendRequests: user.friendRequests,
        phone: user.phone,
        twofaEnabled: user.twofaEnabled,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, bio, photo, phone } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (photo) updates.photo = photo;
    if (phone !== undefined) updates.phone = phone;

    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true }).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/friend-request/:userId", authMiddleware, async (req, res) => {
  try {
    const target = await User.findById(req.params.userId);
    if (!target) return res.status(404).json({ msg: "User not found" });

    if (target.friendRequests.includes(req.userId)) {
      return res.status(400).json({ msg: "Request already sent" });
    }
    if (target.friends.includes(req.userId)) {
      return res.status(400).json({ msg: "Already friends" });
    }

    target.friendRequests.push(req.userId);
    await target.save();

    res.json({ msg: "Friend request sent" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/accept-request/:userId", authMiddleware, async (req, res) => {
  try {
    const me = await User.findById(req.userId);
    const sender = await User.findById(req.params.userId);

    if (!sender) return res.status(404).json({ msg: "User not found" });

    me.friendRequests = me.friendRequests.filter(
      id => id.toString() !== req.params.userId
    );
    if (!me.friends.includes(sender._id)) me.friends.push(sender._id);
    if (!sender.friends.includes(me._id)) sender.friends.push(me._id);

    await me.save();
    await sender.save();

    res.json({ msg: "Friend request accepted", friends: me.friends });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/search", authMiddleware, async (req, res) => {
  try {
    const q = req.query.q || "";
    const users = await User.find({
      _id: { $ne: req.userId },
      name: { $regex: q, $options: "i" }
    }).select("name email photo");

    res.json({ users });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.put("/location", authMiddleware, async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { location: { lat, lng }, lastActive: new Date() },
      { new: true }
    ).select("-password");

    res.json({ user });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
