const router = require('express').Router();
const { getConversations, getMessages, sendMessage, markSeen, deleteMessage } = require('../controllers/messageController');
const auth = require('../middleware/auth');

router.get('/conversations', auth, getConversations);
router.get('/conversations/:conversationId/messages', auth, getMessages);
router.post('/send', auth, sendMessage);
router.put('/seen', auth, markSeen);
router.delete('/:messageId', auth, deleteMessage);

module.exports = router;
