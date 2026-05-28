const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, maxlength: [5000, 'Message cannot exceed 5000 characters'] },
    image: { type: String },
    file: { type: String },
    fileType: { type: String },
    fileName: { type: String },
    readBy: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, readAt: { type: Date, default: Date.now } }],
    deliveredTo: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, deliveredAt: { type: Date, default: Date.now } }],
    deletedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isDeleted: { type: Boolean, default: false },
    type: { type: String, enum: ['text', 'image', 'file', 'call'], default: 'text' },
    callType: { type: String, enum: ['audio', 'video'] },
    callDuration: { type: Number },
    callStatus: { type: String, enum: ['missed', 'answered', 'ended'] },
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  },
  { timestamps: true }
);

messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });

module.exports = mongoose.model('Message', messageSchema);
