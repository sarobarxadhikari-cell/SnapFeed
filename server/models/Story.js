const mongoose = require('mongoose');

const storySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    media: { type: String, required: true },
    type: { type: String, enum: ['image', 'video'], default: 'image' },
    caption: { type: String, maxlength: [300, 'Caption cannot exceed 300 characters'] },
    backgroundColor: { type: String, default: '#000000' },
    textColor: { type: String, default: '#ffffff' },
    viewedBy: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, viewedAt: { type: Date, default: Date.now } }],
    expiresAt: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

storySchema.index({ user: 1, createdAt: -1 });
storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Story', storySchema);
