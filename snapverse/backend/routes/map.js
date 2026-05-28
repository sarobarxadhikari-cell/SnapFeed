import express from "express";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/friends", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const friendIds = user.friends.map(f => f.toString());

    const friends = await User.find({ _id: { $in: friendIds } })
      .select("name photo location lastActive");

    const locations = friends
      .filter(f => f.location.lat !== 0 || f.location.lng !== 0)
      .map(f => ({
        id: f._id,
        name: f.name,
        photo: f.photo,
        lat: f.location.lat,
        lng: f.location.lng,
        lastActive: f.lastActive
      }));

    res.json({ locations });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.put("/me", authMiddleware, async (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ msg: "lat and lng required" });
    }

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
