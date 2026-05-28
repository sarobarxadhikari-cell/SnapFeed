const Story = require('../models/Story');

exports.createStory = async (req, res) => {
  try {
    const { caption, backgroundColor, textColor } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: 'Media file required' });
    const story = await Story.create({ user: req.user._id, media: `/uploads/${req.file.filename}`, caption, backgroundColor, textColor });
    await story.populate('user', 'name avatar');
    req.app.get('io').emit('new_story', story.toJSON());
    res.status(201).json({ success: true, story: story.toJSON() });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getStories = async (req, res) => {
  try {
    const stories = await Story.find({ expiresAt: { $gt: new Date() }, isActive: true })
      .populate('user', 'name avatar')
      .populate('viewedBy.user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, stories });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.viewStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ success: false, message: 'Story not found' });
    const alreadyViewed = story.viewedBy.some((v) => v.user.toString() === req.user._id.toString());
    if (!alreadyViewed) {
      story.viewedBy.push({ user: req.user._id });
      await story.save();
    }
    res.json({ success: true, story: story.toJSON() });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteStory = async (req, res) => {
  try {
    const story = await Story.findOne({ _id: req.params.id, user: req.user._id });
    if (!story) return res.status(404).json({ success: false, message: 'Story not found or unauthorized' });
    story.isActive = false;
    await story.save();
    res.json({ success: true, message: 'Story deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
