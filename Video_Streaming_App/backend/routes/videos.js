const express = require('express');
const { body } = require('express-validator');
const { auth, optionalAuth } = require('../middleware/auth');
const { uploadVideo, handleMulterError } = require('../middleware/upload');
const {
  uploadVideo: uploadVideoController,
  getVideos,
  getVideoById,
  toggleLike,
  toggleDislike,
  getUserVideos,
  streamVideo,
  deleteVideo,
  addYouTubeVideo
} = require('../controllers/videoController');

const router = express.Router();

// Upload video
router.post('/upload', auth, uploadVideo.single('video'), [
  body('title')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 5000 })
    .withMessage('Description cannot exceed 5000 characters'),
  body('category')
    .optional()
    .isIn(['Entertainment', 'Education', 'Music', 'Gaming', 'Sports', 'News', 'Technology', 'Other'])
    .withMessage('Invalid category'),
  body('visibility')
    .optional()
    .isIn(['public', 'private', 'unlisted'])
    .withMessage('Invalid visibility setting')
], handleMulterError, uploadVideoController);

// Add YouTube video
router.post('/youtube', auth, [
  body('youtubeUrl')
    .notEmpty()
    .withMessage('YouTube URL is required')
    .matches(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/)
    .withMessage('Please provide a valid YouTube URL'),
  body('title')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 5000 })
    .withMessage('Description cannot exceed 5000 characters'),
  body('category')
    .optional()
    .isIn(['Entertainment', 'Education', 'Music', 'Gaming', 'Sports', 'News', 'Technology', 'Other'])
    .withMessage('Invalid category'),
  body('visibility')
    .optional()
    .isIn(['public', 'private', 'unlisted'])
    .withMessage('Invalid visibility setting')
], addYouTubeVideo);

// Get all videos
router.get('/', optionalAuth, getVideos);

// Get single video by ID
router.get('/:id', optionalAuth, getVideoById);

// Get user uploaded videos
router.get('/user/videos', auth, getUserVideos);

// Stream video
router.get('/stream/:id', streamVideo);

// Like a video
router.post('/:id/like', auth, toggleLike);

// Dislike a video
router.post('/:id/dislike', auth, toggleDislike);

// Delete video
router.delete('/:id', auth, deleteVideo);

module.exports = router;
