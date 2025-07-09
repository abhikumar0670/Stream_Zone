const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [20, 'Username cannot exceed 20 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  avatar: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  subscribers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  subscriptions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  watchHistory: [{
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video'
    },
    watchedAt: {
      type: Date,
      default: Date.now
    }
  }],
  likedVideos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get user stats
userSchema.methods.getStats = function() {
  return {
    subscribersCount: this.subscribers.length,
    subscriptionsCount: this.subscriptions.length,
    watchHistoryCount: this.watchHistory.length
  };
};

module.exports = mongoose.model('User', userSchema);
