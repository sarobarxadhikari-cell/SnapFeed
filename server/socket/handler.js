const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const Call = require('../models/Call');
const Notification = require('../models/Notification');

const onlineUsers = new Map();

module.exports = (io) => {
  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (!userId) return socket.disconnect();

    onlineUsers.set(userId.toString(), socket.id);
    socket.userId = userId;
    socket.join(userId.toString());
    User.findByIdAndUpdate(userId, { isOnline: true, socketId: socket.id }).catch(() => {});
    io.emit('user_online', { userId, socketId: socket.id });

    socket.on('join_conversation', (conversationId) => {
      socket.join(conversationId);
    });

    socket.on('leave_conversation', (conversationId) => {
      socket.leave(conversationId);
    });

    socket.on('send_message', async (data, callback) => {
      try {
        const { conversationId, text, replyTo } = data;
        let conversation = await Conversation.findById(conversationId);
        if (!conversation) return callback?.({ error: 'Conversation not found' });
        const message = await Message.create({ conversation: conversationId, sender: userId, text, replyTo });
        conversation.lastMessage = message._id;
        conversation.lastMessageAt = new Date();
        await conversation.save();
        const populated = await Message.findById(message._id).populate('sender', 'name avatar');
        io.to(conversationId).emit('new_message', populated.toJSON());
        callback?.(populated.toJSON());
        const recipient = conversation.participants.find((p) => p.toString() !== userId.toString());
        if (recipient) {
          const notif = await Notification.create({ user: recipient, from: userId, type: 'message', title: 'New message', data: { conversationId, messageId: message._id } });
          const notifPopulated = await Notification.findById(notif._id).populate('from', 'name avatar');
          io.to(recipient.toString()).emit('new_notification', notifPopulated.toJSON());
        }
      } catch (err) {
        callback?.({ error: err.message });
      }
    });

    socket.on('typing_start', ({ conversationId }) => {
      socket.to(conversationId).emit('typing_start', { conversationId, userId });
    });

    socket.on('typing_stop', ({ conversationId }) => {
      socket.to(conversationId).emit('typing_stop', { conversationId, userId });
    });

    socket.on('mark_seen', async ({ conversationId }) => {
      try {
        await Message.updateMany(
          { conversation: conversationId, sender: { $ne: userId }, 'readBy.user': { $ne: userId } },
          { $push: { readBy: { user: userId, readAt: new Date() } } }
        );
        io.to(conversationId).emit('messages_seen', { conversationId, userId });
      } catch (err) {}
    });

    socket.on('call_user', async (data, callback) => {
      try {
        const { receiverId, type } = data;
        const caller = await User.findById(userId).select('name avatar');
        const call = await Call.create({ caller: userId, receiver: receiverId, type });
        io.to(receiverId).emit('incoming_call', { callId: call._id, caller, type });
        callback?.({ success: true, callId: call._id });
      } catch (err) {
        callback?.({ error: err.message });
      }
    });

    socket.on('call_accepted', async ({ callId }) => {
      const call = await Call.findByIdAndUpdate(callId, { status: 'ongoing', startedAt: new Date() }, { new: true });
      if (call) {
        io.to(call.caller.toString()).emit('call_accepted', { callId });
        io.to(call.receiver.toString()).emit('call_accepted', { callId });
      }
    });

    socket.on('call_rejected', async ({ callId }) => {
      const call = await Call.findByIdAndUpdate(callId, { status: 'rejected' }, { new: true });
      if (call) io.to(call.caller.toString()).emit('call_rejected', { callId });
    });

    socket.on('call_ended', async ({ callId, duration }) => {
      const call = await Call.findByIdAndUpdate(callId, { status: 'ended', endedAt: new Date(), duration }, { new: true });
      if (call) {
        io.to(call.caller.toString()).emit('call_ended', { callId, duration });
        io.to(call.receiver.toString()).emit('call_ended', { callId, duration });
      }
    });

    socket.on('ice_candidate', ({ callId, candidate, to }) => {
      io.to(to).emit('ice_candidate', { callId, candidate, from: userId });
    });

    socket.on('offer', ({ callId, offer, to }) => {
      io.to(to).emit('offer', { callId, offer, from: userId });
    });

    socket.on('answer', ({ callId, answer, to }) => {
      io.to(to).emit('answer', { callId, answer, from: userId });
    });

    socket.on('call_mute', ({ callId, to }) => {
      io.to(to).emit('call_mute', { callId, userId });
    });

    socket.on('call_unmute', ({ callId, to }) => {
      io.to(to).emit('call_unmute', { callId, userId });
    });

    socket.on('call_camera_off', ({ callId, to }) => {
      io.to(to).emit('call_camera_off', { callId, userId });
    });

    socket.on('call_camera_on', ({ callId, to }) => {
      io.to(to).emit('call_camera_on', { callId, userId });
    });

    socket.on('disconnect', async () => {
      onlineUsers.delete(userId.toString());
      await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen: new Date(), socketId: '' }).catch(() => {});
      io.emit('user_offline', { userId });
    });
  });
};
