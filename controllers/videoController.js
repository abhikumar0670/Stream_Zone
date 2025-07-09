const Video = require('../models/Video');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// Upload video
const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file provided' });
    }

    const { title, description, category, tags, visibility } = req.body;

    // Parse tags if provided
    let videoTags = [];
    if (tags) {
      videoTags = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags;
    }

    // Create video record
    const video = new Video({
      title,
      description,
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      videoUrl: `/uploads/videos/${req.file.filename}`,
      uploader: req.user.id,
      category: category || 'Other',
      tags: videoTags,
      visibility: visibility || 'public'
    });

    await video.save();

    res.status(201).json({
      message: 'Video uploaded successfully',
      video: {
        id: video._id,
        title: video.title,
        description: video.description,
        videoUrl: video.videoUrl,
        thumbnail: video.thumbnail,
        category: video.category,
        tags: video.tags,
        visibility: video.visibility,
        uploader: req.user.username,
        createdAt: video.createdAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all videos (with pagination and filters)
const getVideos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { category, search, uploader, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    // Build filter object
    const filter = { visibility: 'public' };
    
    if (category) {
      filter.category = category;
    }
    
    if (uploader) {
      const uploaderUser = await User.findOne({ username: uploader });
      if (uploaderUser) {
        filter.uploader = uploaderUser._id;
      }
    }

    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const videos = await Video.find(filter)
      .populate('uploader', 'username avatar')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Video.countDocuments(filter);

    res.json({
      videos: videos.map(video => ({
        id: video._id,
        title: video.title,
        description: video.description,
        videoUrl: video.videoUrl,
        thumbnail: video.thumbnail,
        duration: video.duration,
        views: video.views,
        category: video.category,
        tags: video.tags,
        uploader: {
          id: video.uploader._id,
          username: video.uploader.username,
          avatar: video.uploader.avatar
        },
        stats: video.getStats(),
        createdAt: video.createdAt
      })),
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get video by ID
const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('uploader', 'username avatar bio subscribers')
      .populate('comments');

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Check if video is private and user is not the uploader
    if (video.visibility === 'private' && 
        (!req.user || req.user.id !== video.uploader._id.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Increment view count (only if user is not the uploader)
    if (!req.user || req.user.id !== video.uploader._id.toString()) {
      await video.addView();
    }

    // Add to user's watch history if logged in
    if (req.user) {
      await User.findByIdAndUpdate(req.user.id, {
        $addToSet: {
          watchHistory: {
            video: video._id,
            watchedAt: new Date()
          }
        }
      });
    }

    res.json({
      video: {
        id: video._id,
        title: video.title,
        description: video.description,
        videoUrl: video.videoUrl,
        thumbnail: video.thumbnail,
        duration: video.duration,
        views: video.views,
        category: video.category,
        tags: video.tags,
        visibility: video.visibility,
        uploader: {
          id: video.uploader._id,
          username: video.uploader.username,
          avatar: video.uploader.avatar,
          bio: video.uploader.bio,
          subscribersCount: video.uploader.subscribers.length
        },
        stats: video.getStats(),
        isLiked: req.user ? video.isLikedBy(req.user.id) : false,
        isDisliked: req.user ? video.isDislikedBy(req.user.id) : false,
        createdAt: video.createdAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Like/Unlike video
const toggleLike = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const isLiked = video.isLikedBy(req.user.id);
    const isDisliked = video.isDislikedBy(req.user.id);

    if (isLiked) {
      // Remove like
      video.likes = video.likes.filter(like => 
        like.user.toString() !== req.user.id
      );
    } else {
      // Add like
      video.likes.push({ user: req.user.id });
      
      // Remove dislike if exists
      if (isDisliked) {
        video.dislikes = video.dislikes.filter(dislike => 
          dislike.user.toString() !== req.user.id
        );
      }
    }

    await video.save();

    res.json({
      message: isLiked ? 'Like removed' : 'Video liked',
      stats: video.getStats(),
      isLiked: !isLiked,
      isDisliked: false
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Dislike/Remove dislike video
const toggleDislike = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const isLiked = video.isLikedBy(req.user.id);
    const isDisliked = video.isDislikedBy(req.user.id);

    if (isDisliked) {
      // Remove dislike
      video.dislikes = video.dislikes.filter(dislike => 
        dislike.user.toString() !== req.user.id
      );
    } else {
      // Add dislike
      video.dislikes.push({ user: req.user.id });
      
      // Remove like if exists
      if (isLiked) {
        video.likes = video.likes.filter(like => 
          like.user.toString() !== req.user.id
        );
      }
    }

    await video.save();

    res.json({
      message: isDisliked ? 'Dislike removed' : 'Video disliked',
      stats: video.getStats(),
      isLiked: false,
      isDisliked: !isDisliked
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's uploaded videos
const getUserVideos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const videos = await Video.find({ uploader: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Video.countDocuments({ uploader: req.user.id });

    res.json({
      videos: videos.map(video => ({
        id: video._id,
        title: video.title,
        description: video.description,
        videoUrl: video.videoUrl,
        thumbnail: video.thumbnail,
        duration: video.duration,
        views: video.views,
        category: video.category,
        tags: video.tags,
        visibility: video.visibility,
        stats: video.getStats(),
        createdAt: video.createdAt
      })),
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Stream video
const streamVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const videoPath = path.join(__dirname, '../uploads/videos', video.filename);
    
    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ message: 'Video file not found' });
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete video
const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Check if user is the uploader or admin
    if (video.uploader.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Delete video file
    const videoPath = path.join(__dirname, '../uploads/videos', video.filename);
    if (fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
    }

    // Delete thumbnail if exists
    if (video.thumbnail) {
      const thumbnailPath = path.join(__dirname, '../uploads/images', video.thumbnail);
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }

    await Video.findByIdAndDelete(req.params.id);

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  uploadVideo,
  getVideos,
  getVideoById,
  toggleLike,
  toggleDislike,
  getUserVideos,
  streamVideo,
  deleteVideo
};
