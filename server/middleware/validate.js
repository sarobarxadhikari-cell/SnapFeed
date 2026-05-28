const validator = require('validator');

const validate = (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    if (email && !validator.isEmail(email)) return res.status(400).json({ success: false, message: 'Invalid email format' });
    if (password && !validator.isLength(password, { min: 8 })) return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    if (name && !validator.isLength(name, { min: 2, max: 50 })) return res.status(400).json({ success: false, message: 'Name must be between 2 and 50 characters' });
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: 'Validation error' });
  }
};

module.exports = validate;
