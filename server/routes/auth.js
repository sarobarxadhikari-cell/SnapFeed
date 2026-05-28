const router = require('express').Router();
const { signup, login, logout, refreshToken, getMe, updateProfile, checkEmail } = require('../controllers/authController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimit');

router.post('/signup', validate, signup);
router.post('/login', authLimiter, login);
router.post('/logout', auth, logout);
router.post('/refresh-token', refreshToken);
router.get('/me', auth, getMe);
router.put('/profile', auth, upload.single('avatar'), updateProfile);
router.get('/check-email', checkEmail);

module.exports = router;
