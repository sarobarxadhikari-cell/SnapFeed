const User = require('../models/User');

exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ success: true, users: [] });
    const users = await User.find({ name: { $regex: q, $options: 'i' }, _id: { $ne: req.user._id } }).limit(20).select('name email avatar isOnline lastSeen bio');
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name email avatar isOnline lastSeen bio phone');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getOnlineUsers = async (req, res) => {
  try {
    const users = await User.find({ isOnline: true, _id: { $ne: req.user._id } }).select('name avatar isOnline');
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
