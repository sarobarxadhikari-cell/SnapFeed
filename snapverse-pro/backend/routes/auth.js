import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../config/db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "snapverse_jwt_secret";

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ msg: "All fields required" });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ msg: "Email already registered" });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    const token = jwt.sign({ id: user.id || user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user: { id: user.id || user._id, name: user.name, email: user.email, photo: user.photo || "", online: false } });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "No account found" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ msg: "Wrong password" });
    user.online = true;
    await user.save();
    const token = jwt.sign({ id: user.id || user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id || user._id, name: user.name, email: user.email, photo: user.photo || "", online: true } });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
