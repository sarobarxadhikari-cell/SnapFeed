import mongoose from "mongoose";

const StorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  media: { type: String, required: true },
  caption: { type: String, default: "" },
  viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  expiresAt: { type: Date, default: () => new Date(Date.now() + 86400000) },
  createdAt: { type: Date, default: Date.now }
});

StorySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Story", StorySchema);
