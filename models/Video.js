const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Video title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  filename: {
    type: String,
    required: [true, 'Video filename is required']
  },
  originalName: {
    type: String,
    required: [true, 'Original filename is required']
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required']
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  thumbnail: {
    type: String,
    default: null
  },
  videoUrl: {
    type: String,
    required: [true, 'Video URL is required']
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader is required']
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  dislikes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    enum: ['Entertainment', 'Education', 'Music', 'Gaming', 'Sports', 'News', 'Technology', 'Other'],
    default: 'Other'
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'unlisted'],
    default: 'public'
  },
  isProcessed: {
    type: Boolean,
    default: false
  },
  processingStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  quality: [{
    resolution: String, // '720p', '1080p', etc.
    url: String,
    size: Number
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
videoSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Get video stats
videoSchema.methods.getStats = function() {
  return {
    viewsCount: this.views,
    likesCount: this.likes.length,
    dislikesCount: this.dislikes.length,
    commentsCount: this.comments.length
  };
};

// Check if user liked the video
videoSchema.methods.isLikedBy = function(userId) {
  return this.likes.some(like => like.user.toString() === userId.toString());
};

// Check if user disliked the video
videoSchema.methods.isDislikedBy = function(userId) {
  return this.dislikes.some(dislike => dislike.user.toString() === userId.toString());
};

// Add view
videoSchema.methods.addView = function() {
  this.views += 1;
  return this.save();
};

// Create indexes for better performance
videoSchema.index({ title: 'text', description: 'text', tags: 'text' });
videoSchema.index({ uploader: 1, createdAt: -1 });
videoSchema.index({ category: 1, createdAt: -1 });
videoSchema.index({ visibility: 1, createdAt: -1 });

module.exports = mongoose.model('Video', videoSchema);
