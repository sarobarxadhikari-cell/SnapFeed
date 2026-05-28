import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] }, transports: ['websocket', 'polling'] });
app.use(express.json());
app.use(cors({ origin: '*', credentials: true }));

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'snapfeed_secret_2026';
const resend = new Resend(process.env.RESEND_API_KEY);

// ═══════════════════════════════════════════════
// MONGOOSE SCHEMAS
// ═══════════════════════════════════════════════
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationCode: String,
  verificationExpiry: Date,
  dateOfBirth: String,
  username: String,
  bio: { type: String, default: '' },
  avatar: { type: String, default: '' },
  coverPhoto: { type: String, default: '' },
  studiedAt: { type: String, default: '' },
  fromLocation: { type: String, default: '' },
  isProfileLocked: { type: Boolean, default: false },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

const friendRequestSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
}, { timestamps: true });

const messageSchema = new mongoose.Schema({
  conversationId: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);
const Message = mongoose.model('Message', messageSchema);

friendRequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });
messageSchema.index({ conversationId: 1, createdAt: -1 });

// ═══════════════════════════════════════════════
// EMAIL SENDER (Resend)
// ═══════════════════════════════════════════════
const sendVerificationEmail = async (toEmail, code) => {
  try {
    await resend.emails.send({
      from: 'SnapFeed <onboarding@resend.dev>',
      to: toEmail,
      subject: 'Verify your SnapFeed account',
      html: `<div style="max-width:400px;margin:0 auto;padding:30px;font-family:Arial,sans-serif;background:#0f172a;color:#fff;border-radius:16px;text-align:center;"><div style="display:inline-block;width:50px;height:50px;border-radius:12px;background:linear-gradient(135deg,#2563eb,#6366f1);text-align:center;line-height:50px;font-weight:bold;font-size:20px;color:#fff;">SF</div><h2 style="font-size:18px;margin:20px 0 10px;">Verify your email</h2><p style="color:#94a3b8;font-size:13px;margin-bottom:25px;">Enter this 6-digit code:</p><span style="display:inline-block;font-size:32px;font-weight:bold;letter-spacing:8px;color:#3b82f6;background:#1e293b;padding:12px 24px;border-radius:10px;">${code}</span><p style="color:#64748b;font-size:11px;margin-top:25px;">Expires in 15 minutes.</p></div>`
    });
    console.log(`Email sent to ${toEmail}`);
  } catch (err) {
    console.error('Email failed:', err.message);
  }
};

// ═══════════════════════════════════════════════
// AUTH MIDDLEWARE
// ═══════════════════════════════════════════════
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch { res.status(401).json({ error: 'Invalid token' }); }
};

// ═══════════════════════════════════════════════
// SOCKET.IO REAL-TIME ENGINE
// ═══════════════════════════════════════════════
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('register_user', (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.join(userId);
    console.log(`User ${userId} online`);
  });

  socket.on('send_message', async ({ senderId, receiverId, text }, callback) => {
    try {
      const conversationId = [senderId, receiverId].sort().join('_');
      const msg = await Message.create({ conversationId, sender: senderId, receiver: receiverId, text });
      const populated = await Message.findById(msg._id).populate('sender', 'fullName avatar');
      io.to(receiverId).emit('receive_message', populated);
      io.to(senderId).emit('message_sent_confirm', populated);
      if (callback) callback({ status: 'ok', msg: populated });
    } catch (err) {
      if (callback) callback({ status: 'error' });
    }
  });

  socket.on('typing_start', ({ senderId, receiverId }) => {
    io.to(receiverId).emit('user_typing', { userId: senderId });
  });

  socket.on('typing_stop', ({ senderId, receiverId }) => {
    io.to(receiverId).emit('user_stop_typing', { userId: senderId });
  });

  socket.on('call_offer', ({ to, offer, from }) => {
    io.to(to).emit('call_offer', { offer, from });
  });

  socket.on('call_answer', ({ to, answer }) => {
    io.to(to).emit('call_answer', { answer });
  });

  socket.on('ice_candidate', ({ to, candidate }) => {
    io.to(to).emit('ice_candidate', { candidate });
  });

  socket.on('call_end', ({ to }) => {
    io.to(to).emit('call_end');
  });

  socket.on('send_friend_request', async ({ senderId, receiverId }) => {
    try {
      const exists = await FriendRequest.findOne({ sender: senderId, receiver: receiverId });
      if (exists) return;
      const newRequest = await FriendRequest.create({ sender: senderId, receiver: receiverId });
      const senderData = await User.findById(senderId).select('fullName avatar');
      io.to(receiverId).emit('notification_friend_request', { requestId: newRequest._id, sender: senderData });
    } catch (err) { console.error(err); }
  });

  socket.on('accept_friend_request', async ({ requestId, userId }) => {
    try {
      const reqDoc = await FriendRequest.findById(requestId);
      if (!reqDoc) return;
      await User.findByIdAndUpdate(reqDoc.sender, { $addToSet: { friends: reqDoc.receiver } });
      await User.findByIdAndUpdate(reqDoc.receiver, { $addToSet: { friends: reqDoc.sender } });
      reqDoc.status = 'accepted';
      await reqDoc.save();
      io.to(reqDoc.sender.toString()).emit('friend_request_accepted', { friendId: reqDoc.receiver });
      io.to(reqDoc.receiver.toString()).emit('friend_request_accepted', { friendId: reqDoc.sender });
    } catch (err) { console.error(err); }
  });

  socket.on('reject_friend_request', async ({ requestId }) => {
    try {
      await FriendRequest.findByIdAndUpdate(requestId, { status: 'rejected' });
    } catch (err) { console.error(err); }
  });

  socket.on('disconnect', () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) { onlineUsers.delete(userId); break; }
    }
  });
});

// ═══════════════════════════════════════════════
// AUTH ROUTES
// ═══════════════════════════════════════════════
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) return res.status(400).json({ error: 'All fields required' });
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ error: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 12);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await User.create({ fullName, email: email.toLowerCase(), password: hashed, verificationCode: code, verificationExpiry: new Date(Date.now() + 900000) });
    sendVerificationEmail(email, code).catch(() => {});
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ message: 'Account created', token, user: { id: user._id, fullName: user.fullName, email: user.email, isVerified: false } });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/auth/verify', async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.isVerified) { const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' }); return res.json({ message: 'Already verified', token, user: { id: user._id, fullName: user.fullName, email: user.email } }); }
    if (user.verificationExpiry < new Date()) return res.status(400).json({ error: 'Code expired' });
    if (user.verificationCode !== code) return res.status(400).json({ error: 'Invalid code' });
    user.isVerified = true; user.verificationCode = undefined; user.verificationExpiry = undefined;
    await user.save();
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Verified!', token, user: { id: user._id, fullName: user.fullName, email: user.email } });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/auth/resend-code', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = code; user.verificationExpiry = new Date(Date.now() + 900000);
    await user.save();
    sendVerificationEmail(email, code).catch(() => {});
    res.json({ message: 'Code sent' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ error: 'Account not found' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Incorrect password' });
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Login successful', token, user: { id: user._id, fullName: user.fullName, email: user.email, isVerified: user.isVerified } });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password -verificationCode -verificationExpiry');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/auth/profile', authMiddleware, async (req, res) => {
  try {
    const { fullName, username, dateOfBirth, bio, avatar, coverPhoto, studiedAt, fromLocation, isProfileLocked } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (fullName) user.fullName = fullName;
    if (username !== undefined) user.username = username;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;
    if (coverPhoto !== undefined) user.coverPhoto = coverPhoto;
    if (studiedAt !== undefined) user.studiedAt = studiedAt;
    if (fromLocation !== undefined) user.fromLocation = fromLocation;
    if (isProfileLocked !== undefined) user.isProfileLocked = isProfileLocked;
    await user.save();
    res.json({ user: { id: user._id, fullName: user.fullName, email: user.email, username: user.username, dateOfBirth: user.dateOfBirth, bio: user.bio, avatar: user.avatar, coverPhoto: user.coverPhoto, studiedAt: user.studiedAt, fromLocation: user.fromLocation, isProfileLocked: user.isProfileLocked, isVerified: user.isVerified } });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/auth/change-email', authMiddleware, async (req, res) => {
  try {
    const { newEmail } = req.body;
    if (!newEmail || !newEmail.includes('@')) return res.status(400).json({ error: 'Valid email required' });
    const exists = await User.findOne({ email: newEmail.toLowerCase() });
    if (exists && exists._id.toString() !== req.userId) return res.status(400).json({ error: 'Email in use' });
    const user = await User.findById(req.userId);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.email = newEmail.toLowerCase(); user.isVerified = false; user.verificationCode = code; user.verificationExpiry = new Date(Date.now() + 900000);
    await user.save();
    sendVerificationEmail(newEmail, code).catch(() => {});
    res.json({ message: 'Code sent' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// ═══════════════════════════════════════════════
// USER SEARCH + PUBLIC PROFILE
// ═══════════════════════════════════════════════
app.get('/api/users/search', authMiddleware, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ users: [] });
    const users = await User.find({ fullName: { $regex: q, $options: 'i' } }).select('fullName avatar bio username').limit(20);
    res.json({ users });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/users/profile/:targetId', authMiddleware, async (req, res) => {
  try {
    const { targetId } = req.params;
    const target = await User.findById(targetId).select('-password -verificationCode -verificationExpiry').populate('friends', 'fullName avatar');
    if (!target) return res.status(404).json({ error: 'User not found' });
    const currentUser = await User.findById(req.userId).select('friends');
    const isFriend = target.friends.some(f => f._id.toString() === req.userId);
    const isSelf = targetId === req.userId;
    let requestStatus = 'none';
    if (!isFriend && !isSelf) {
      const sent = await FriendRequest.findOne({ sender: req.userId, receiver: targetId, status: 'pending' });
      if (sent) requestStatus = 'sent';
      const received = await FriendRequest.findOne({ sender: targetId, receiver: req.userId, status: 'pending' });
      if (received) requestStatus = 'received';
    }
    if (target.isProfileLocked && !isFriend && !isSelf) {
      return res.json({ user: { _id: target._id, fullName: target.fullName, avatar: target.avatar, coverPhoto: target.coverPhoto, bio: target.bio, studiedAt: target.studiedAt, fromLocation: target.fromLocation, isProfileLocked: true, friends: target.friends.slice(0, 6) }, privacy: { isFriend: false, isSelf, requestStatus, canSeePosts: false } });
    }
    res.json({ user: target, privacy: { isFriend, isSelf, requestStatus, canSeePosts: true } });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// ═══════════════════════════════════════════════
// FRIEND REQUESTS
// ═══════════════════════════════════════════════
app.get('/api/friends/requests', authMiddleware, async (req, res) => {
  try {
    const received = await FriendRequest.find({ receiver: req.userId, status: 'pending' }).populate('sender', 'fullName avatar bio');
    const sent = await FriendRequest.find({ sender: req.userId, status: 'pending' }).populate('receiver', 'fullName avatar');
    res.json({ received, sent });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/friends/list', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('friends', 'fullName avatar bio username');
    res.json({ friends: user.friends });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/friends/accept/:requestId', authMiddleware, async (req, res) => {
  try {
    const reqDoc = await FriendRequest.findById(req.params.requestId);
    if (!reqDoc) return res.status(404).json({ error: 'Request not found' });
    await User.findByIdAndUpdate(reqDoc.sender, { $addToSet: { friends: reqDoc.receiver } });
    await User.findByIdAndUpdate(reqDoc.receiver, { $addToSet: { friends: reqDoc.sender } });
    reqDoc.status = 'accepted';
    await reqDoc.save();
    res.json({ message: 'Friend request accepted' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/friends/reject/:requestId', authMiddleware, async (req, res) => {
  try {
    await FriendRequest.findByIdAndUpdate(req.params.requestId, { status: 'rejected' });
    res.json({ message: 'Friend request rejected' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/friends/request', authMiddleware, async (req, res) => {
  try {
    const { receiverId } = req.body;
    const exists = await FriendRequest.findOne({ sender: req.userId, receiver: receiverId });
    if (exists) return res.status(400).json({ error: 'Already sent' });
    await FriendRequest.create({ sender: req.userId, receiver: receiverId });
    res.json({ message: 'Friend request sent' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.delete('/api/friends/remove/:friendId', authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, { $pull: { friends: req.params.friendId } });
    await User.findByIdAndUpdate(req.params.friendId, { $pull: { friends: req.userId } });
    res.json({ message: 'Friend removed' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// ═══════════════════════════════════════════════
// MESSAGES
// ═══════════════════════════════════════════════
app.get('/api/messages/:otherUserId', authMiddleware, async (req, res) => {
  try {
    const conversationId = [req.userId, req.params.otherUserId].sort().join('_');
    const messages = await Message.find({ conversationId }).populate('sender', 'fullName avatar').sort({ createdAt: 1 }).limit(100);
    res.json({ messages });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/messages', authMiddleware, async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      { $match: { $or: [{ sender: new mongoose.Types.ObjectId(req.userId) }, { receiver: new mongoose.Types.ObjectId(req.userId) }] } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$conversationId', lastMessage: { $first: '$$ROOT' } } },
      { $limit: 50 }
    ]);
    const populated = await Message.populate(conversations, { path: 'lastMessage.sender', model: 'User', select: 'fullName avatar' });
    await Message.populate(populated, { path: 'lastMessage.receiver', model: 'User', select: 'fullName avatar' });
    res.json({ conversations: populated });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/messages/read/:otherUserId', authMiddleware, async (req, res) => {
  try {
    await Message.updateMany({ sender: req.params.otherUserId, receiver: req.userId, isRead: false }, { isRead: true });
    res.json({ message: 'Messages marked as read' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// ═══════════════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════════════
app.get('/api/health', (req, res) => { res.json({ status: 'ok', online: onlineUsers.size, timestamp: new Date().toISOString() }); });

// ═══════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════
mongoose.connect(process.env.MONGODB_URI)
  .then(() => { console.log('Connected to MongoDB'); server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); })
  .catch(err => { console.error('MongoDB error:', err); process.exit(1); });
