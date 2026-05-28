const router = require('express').Router();
const { searchUsers, getUserById, getOnlineUsers } = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/search', auth, searchUsers);
router.get('/online', auth, getOnlineUsers);
router.get('/:id', auth, getUserById);

module.exports = router;
