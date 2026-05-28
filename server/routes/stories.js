const router = require('express').Router();
const { createStory, getStories, viewStory, deleteStory } = require('../controllers/storyController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', auth, getStories);
router.post('/', auth, upload.single('media'), createStory);
router.put('/:id/view', auth, viewStory);
router.delete('/:id', auth, deleteStory);

module.exports = router;
