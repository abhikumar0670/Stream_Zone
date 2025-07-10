const express = require('express');
const { body } = require('express-validator');
const { auth } = require('../middleware/auth');
const { uploadImage, handleMulterError } = require('../middleware/upload');
const {
  register,
  login,
  getMe,
  updateProfile,
  updateAvatar
} = require('../controllers/authController');

const router = express.Router();

// Register user
router.post('/register', [
  body('username')
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
], register);

// Login user
router.post('/login', [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], login);

// Get current user
router.get('/me', auth, getMe);

// Update user profile
router.put('/profile', auth, [
  body('username')
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters')
], updateProfile);

// Upload/update avatar
router.post('/avatar', auth, uploadImage.single('avatar'), handleMulterError, updateAvatar);

// Test endpoint to check database connection and user count
router.get('/test', async (req, res) => {
  try {
    const User = require('../models/User');
    const userCount = await User.countDocuments();
    res.json({ 
      message: 'Database connection working',
      userCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

module.exports = router;
