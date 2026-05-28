const router = require('express').Router();
const { getNotifications, markNotificationRead, deleteNotification } = require('../controllers/notificationController');
const auth = require('../middleware/auth');

router.get('/', auth, getNotifications);
router.put('/:id/read', auth, markNotificationRead);
router.delete('/:id', auth, deleteNotification);

module.exports = router;
