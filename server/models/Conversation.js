const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    lastMessageAt: { type: Date },
    isGroup: { type: Boolean, default: false },
    groupName: { type: String, maxlength: [100, 'Group name cannot exceed 100 characters'] },
    groupAvatar: { type: String },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    typing: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, startedAt: { type: Date, default: Date.now } }],
  },
  { timestamps: true }
);

conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageAt: -1 });

module.exports = mongoose.model('Conversation', conversationSchema);
