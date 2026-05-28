const mongoose = require('mongoose');

const callSchema = new mongoose.Schema(
  {
    caller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['audio', 'video'], required: true },
    status: { type: String, enum: ['ringing', 'ongoing', 'ended', 'missed', 'rejected'], default: 'ringing' },
    startedAt: { type: Date },
    endedAt: { type: Date },
    duration: { type: Number, default: 0 },
  },
  { timestamps: true }
);

callSchema.index({ caller: 1, createdAt: -1 });
callSchema.index({ receiver: 1, createdAt: -1 });

module.exports = mongoose.model('Call', callSchema);
