const express = require('express');
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
  deleteVideo
} = require('../controllers/videoController');

const router = express.Router();

// Upload video
router.post('/upload', [auth, uploadVideo.single('video'), handleMulterError], uploadVideoController);

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
