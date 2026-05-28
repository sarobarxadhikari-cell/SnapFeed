const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
const generateRefreshToken = (id) => jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' });
const setTokenCookie = (res, token) => {
  res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });
    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshTokens.push({ token: refreshToken });
    await user.save();
    setTokenCookie(res, token);
    res.status(201).json({ success: true, token, refreshToken, user: user.toJSON() });
  } catch (err) {
    console.error('Signup error:', err);
    if (err.code === 11000) return res.status(400).json({ success: false, message: 'Email already exists' });
    res.status(500).json({ success: false, message: 'Server error during signup' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshTokens.push({ token: refreshToken });
    user.isOnline = true;
    await user.save();
    setTokenCookie(res, token);
    res.json({ success: true, token, refreshToken, user: user.toJSON() });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

exports.logout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.isOnline = false;
      user.lastSeen = new Date();
      user.socketId = '';
      if (req.body.refreshToken) user.refreshTokens = user.refreshTokens.filter((rt) => rt.token !== req.body.refreshToken);
      await user.save();
    }
    res.clearCookie('token');
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ success: false, message: 'Server error during logout' });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ success: false, message: 'Refresh token required' });
    let decoded;
    try { decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET); }
    catch { return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' }); }
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });
    const tokenExists = user.refreshTokens.some((rt) => rt.token === refreshToken);
    if (!tokenExists) return res.status(401).json({ success: false, message: 'Refresh token not recognized' });
    const newToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);
    user.refreshTokens = user.refreshTokens.filter((rt) => rt.token !== refreshToken);
    user.refreshTokens.push({ token: newRefreshToken });
    await user.save();
    setTokenCookie(res, newToken);
    res.json({ success: true, token: newToken, refreshToken: newRefreshToken, user: user.toJSON() });
  } catch (err) {
    console.error('Refresh token error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, phone, theme } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (phone !== undefined) user.phone = phone;
    if (theme) user.theme = theme;
    if (req.file) user.avatar = `/uploads/${req.file.filename}`;
    await user.save();
    res.json({ success: true, user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
    const existing = await User.findOne({ email: email.toLowerCase() });
    res.json({ success: true, exists: !!existing });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
