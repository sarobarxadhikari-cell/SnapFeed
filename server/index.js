import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: '*', credentials: true }));

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'snapfeed_secret_2026';
const resend = new Resend(process.env.RESEND_API_KEY);

// ═══════════════════════════════════════════════
// MONGOOSE MODELS
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
  bio: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// ═══════════════════════════════════════════════
// EMAIL SENDER (Resend API)
// ═══════════════════════════════════════════════
const sendVerificationEmail = async (toEmail, code) => {
  try {
    await resend.emails.send({
      from: 'SnapFeed <onboarding@resend.dev>',
      to: toEmail,
      subject: 'Verify your SnapFeed account',
      html: `
        <div style="max-width:400px;margin:0 auto;padding:30px;font-family:Arial,sans-serif;background:#0f172a;color:#fff;border-radius:16px;">
          <div style="text-align:center;margin-bottom:20px;">
            <div style="display:inline-block;width:50px;height:50px;border-radius:12px;background:linear-gradient(135deg,#2563eb,#6366f1);text-align:center;line-height:50px;font-weight:bold;font-size:20px;color:#fff;">SF</div>
          </div>
          <h2 style="text-align:center;font-size:18px;margin-bottom:10px;">Verify your email</h2>
          <p style="text-align:center;color:#94a3b8;font-size:13px;margin-bottom:25px;">Enter this 6-digit code:</p>
          <div style="text-align:center;margin-bottom:25px;">
            <span style="display:inline-block;font-size:32px;font-weight:bold;letter-spacing:8px;color:#3b82f6;background:#1e293b;padding:12px 24px;border-radius:10px;">${code}</span>
          </div>
          <p style="text-align:center;color:#64748b;font-size:11px;">Expires in 15 minutes.</p>
        </div>
      `
    });
    console.log(`Email sent to ${toEmail}`);
  } catch (err) {
    console.error('Email send failed:', err.message);
    throw err;
  }
};

// ═══════════════════════════════════════════════
// AUTH MIDDLEWARE
// ═══════════════════════════════════════════════
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ═══════════════════════════════════════════════
// ROUTES: REGISTER
// ═══════════════════════════════════════════════
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      if (!existingUser.isVerified) {
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        existingUser.verificationCode = verificationCode;
        existingUser.verificationExpiry = new Date(Date.now() + 15 * 60 * 1000);
        existingUser.fullName = fullName;
        existingUser.password = await bcrypt.hash(password, 12);
        await existingUser.save();
        sendVerificationEmail(email, verificationCode).catch(() => {});
        return res.status(201).json({ message: 'Verification code resent', userId: existingUser._id });
      }
      return res.status(400).json({ error: 'Email already registered and verified' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpiry = new Date(Date.now() + 15 * 60 * 1000);

    const newUser = new User({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      verificationCode,
      verificationExpiry
    });

    await newUser.save();
    sendVerificationEmail(email, verificationCode).catch(() => {});

    res.status(201).json({ message: 'Verification code sent to your email', userId: newUser._id });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ═══════════════════════════════════════════════
// ROUTES: VERIFY EMAIL
// ═══════════════════════════════════════════════
app.post('/api/auth/verify', async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.isVerified) {
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ message: 'Already verified', token, user: { id: user._id, fullName: user.fullName, email: user.email } });
    }

    if (user.verificationExpiry < new Date()) {
      return res.status(400).json({ error: 'Code expired. Click resend.' });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ error: 'Invalid code' });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationExpiry = undefined;
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Verified!', token, user: { id: user._id, fullName: user.fullName, email: user.email } });
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ═══════════════════════════════════════════════
// ROUTES: RESEND CODE
// ═══════════════════════════════════════════════
app.post('/api/auth/resend-code', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.isVerified) {
      return res.status(400).json({ error: 'Already verified' });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = verificationCode;
    user.verificationExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();
    sendVerificationEmail(email, verificationCode).catch(() => {});

    res.json({ message: 'New code sent' });
  } catch (err) {
    console.error('Resend error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ═══════════════════════════════════════════════
// ROUTES: LOGIN
// ═══════════════════════════════════════════════
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ error: 'Account not found. Please register first.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Incorrect password' });

    if (!user.isVerified) {
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      user.verificationCode = verificationCode;
      user.verificationExpiry = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();
      sendVerificationEmail(email, verificationCode).catch(() => {});
      return res.status(403).json({ error: 'Email not verified. New code sent.', needsVerification: true });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Login successful', token, user: { id: user._id, fullName: user.fullName, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ═══════════════════════════════════════════════
// ROUTES: GET CURRENT USER
// ═══════════════════════════════════════════════
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password -verificationCode -verificationExpiry');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ═══════════════════════════════════════════════
// ROUTES: UPDATE PROFILE
// ═══════════════════════════════════════════════
app.put('/api/auth/profile', authMiddleware, async (req, res) => {
  try {
    const { fullName, username, dateOfBirth, bio } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (fullName) user.fullName = fullName;
    if (username) user.username = username;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (bio !== undefined) user.bio = bio;

    await user.save();
    res.json({ message: 'Profile updated', user: { id: user._id, fullName: user.fullName, email: user.email, username: user.username, dateOfBirth: user.dateOfBirth, bio: user.bio, isVerified: user.isVerified } });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ═══════════════════════════════════════════════
// ROUTES: CHANGE EMAIL
// ═══════════════════════════════════════════════
app.post('/api/auth/change-email', authMiddleware, async (req, res) => {
  try {
    const { newEmail } = req.body;
    if (!newEmail || !newEmail.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' });
    }

    const existingUser = await User.findOne({ email: newEmail.toLowerCase() });
    if (existingUser && existingUser._id.toString() !== req.userId) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.email = newEmail.toLowerCase();
    user.isVerified = false;
    user.verificationCode = verificationCode;
    user.verificationExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();
    sendVerificationEmail(newEmail, verificationCode).catch(() => {});

    res.json({ message: 'Verification code sent to new email' });
  } catch (err) {
    console.error('Change email error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ═══════════════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════════════
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ═══════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
