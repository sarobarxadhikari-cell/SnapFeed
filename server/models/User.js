const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, minlength: [2, 'Name must be at least 2 characters'], maxlength: [50, 'Name cannot exceed 50 characters'] },
    email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'] },
    password: { type: String, required: [true, 'Password is required'], minlength: [8, 'Password must be at least 8 characters'], select: false },
    avatar: { type: String, default: '' },
    avatarPublicId: { type: String, default: '' },
    bio: { type: String, default: '', maxlength: [200, 'Bio cannot exceed 200 characters'] },
    phone: { type: String, default: '' },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
    socketId: { type: String, default: '' },
    refreshTokens: [{ token: String, createdAt: { type: Date, default: Date.now } }],
    trustedDevices: [{ deviceId: String, userAgent: String, trustedAt: { type: Date, default: Date.now } }],
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: String,
    theme: { type: String, enum: ['dark', 'light'], default: 'dark' },
  },
  {
    timestamps: true,
    toJSON: { transform(doc, ret) { delete ret.password; delete ret.refreshTokens; delete ret.twoFactorSecret; delete ret.__v; return ret; } },
  }
);

userSchema.index({ email: 1 });
userSchema.index({ name: 'text' });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
