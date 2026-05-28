const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id })
      .populate('participants', 'name avatar isOnline lastSeen')
      .populate('lastMessage')
      .sort({ lastMessageAt: -1 });
    const unreadCounts = await Promise.all(conversations.map(async (conv) => {
      const count = await Message.countDocuments({ conversation: conv._id, 'readBy.user': { $ne: req.user._id }, sender: { $ne: req.user._id } });
      return { conversationId: conv._id, unreadCount: count };
    }));
    res.json({ success: true, conversations: conversations.map((c, i) => ({ ...c.toJSON(), unreadCount: unreadCounts[i].unreadCount })) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const messages = await Message.find({ conversation: conversationId, deletedFor: { $ne: req.user._id } })
      .sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit))
      .populate('sender', 'name avatar');
    res.json({ success: true, messages: messages.reverse(), hasMore: messages.length === parseInt(limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, text, replyTo } = req.body;
    let conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      conversation = await Conversation.create({ participants: [req.user._id, text], lastMessageAt: new Date() });
    }
    const message = await Message.create({ conversation: conversation._id, sender: req.user._id, text, replyTo });
    conversation.lastMessage = message._id;
    conversation.lastMessageAt = new Date();
    await conversation.save();
    const populated = await Message.findById(message._id).populate('sender', 'name avatar');
    req.app.get('io').to(conversation._id.toString()).emit('new_message', populated.toJSON());
    res.status(201).json({ success: true, message: populated.toJSON() });
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.markSeen = async (req, res) => {
  try {
    const { conversationId } = req.body;
    await Message.updateMany(
      { conversation: conversationId, sender: { $ne: req.user._id }, 'readBy.user': { $ne: req.user._id } },
      { $push: { readBy: { user: req.user._id, readAt: new Date() } } }
    );
    req.app.get('io').to(conversationId.toString()).emit('messages_seen', { conversationId, userId: req.user._id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    await Message.findByIdAndUpdate(messageId, { $push: { deletedFor: req.user._id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
