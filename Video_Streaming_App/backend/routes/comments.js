const express = require('express');
const { auth } = require('../middleware/auth');
const Comment = require('../models/Comment');

const router = express.Router();

// Get comments for a video
router.get('/video/:videoId', async (req, res) => {
  try {
    const comments = await Comment.find({ video: req.params.videoId })
      .populate('author', 'username avatar')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'username avatar'
        }
      })
      .sort({ createdAt: -1 });

    // Add stats and user interaction status to each comment
    const commentsWithStats = comments.map(comment => {
      const commentObj = comment.toObject();
      
      // Convert _id to id for frontend compatibility
      commentObj.id = commentObj._id;
      delete commentObj._id;
      
      commentObj.stats = comment.getStats ? comment.getStats() : { likesCount: 0, dislikesCount: 0, repliesCount: 0 };
      commentObj.isLiked = req.user ? (comment.isLikedBy ? comment.isLikedBy(req.user.id) : false) : false;
      commentObj.isDisliked = req.user ? (comment.isDislikedBy ? comment.isDislikedBy(req.user.id) : false) : false;
      
      // Convert author _id to id
      if (commentObj.author && commentObj.author._id) {
        commentObj.author.id = commentObj.author._id;
        delete commentObj.author._id;
      }
      
      // Add stats to replies as well
      if (commentObj.replies) {
        commentObj.replies = commentObj.replies.map(reply => {
          const replyObj = reply.toObject ? reply.toObject() : reply;
          
          // Convert _id to id for replies too
          replyObj.id = replyObj._id;
          delete replyObj._id;
          
          replyObj.stats = reply.getStats ? reply.getStats() : { likesCount: 0, dislikesCount: 0, repliesCount: 0 };
          replyObj.isLiked = req.user ? (reply.isLikedBy ? reply.isLikedBy(req.user.id) : false) : false;
          replyObj.isDisliked = req.user ? (reply.isDislikedBy ? reply.isDislikedBy(req.user.id) : false) : false;
          
          // Convert author _id to id for replies
          if (replyObj.author && replyObj.author._id) {
            replyObj.author.id = replyObj.author._id;
            delete replyObj.author._id;
          }
          
          return replyObj;
        });
      }
      
      return commentObj;
    });

    res.json({ comments: commentsWithStats });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a comment
router.post('/', auth, async (req, res) => {
  try {
    const { content, videoId, parentCommentId } = req.body;

    if (!content || !videoId) {
      return res.status(400).json({ message: 'Content and video ID are required' });
    }

    const comment = new Comment({
      content,
      author: req.user.id,
      video: videoId,
      parentComment: parentCommentId || null
    });

    await comment.save();

    // If this is a reply, add it to the parent comment's replies array
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { replies: comment._id }
      });
      
      // Also update the parent comment's replies count
      await Comment.findByIdAndUpdate(parentCommentId, {
        $inc: { repliesCount: 1 }
      });
    }

    // Populate author info
    await comment.populate('author', 'username avatar');

    // Add stats to the response
    const commentObj = comment.toObject();
    
    // Convert _id to id for frontend compatibility
    commentObj.id = commentObj._id;
    delete commentObj._id;
    
    commentObj.stats = comment.getStats ? comment.getStats() : { likesCount: 0, dislikesCount: 0, repliesCount: 0 };
    commentObj.isLiked = false;
    commentObj.isDisliked = false;
    
    // Convert author _id to id
    if (commentObj.author && commentObj.author._id) {
      commentObj.author.id = commentObj.author._id;
      delete commentObj.author._id;
    }

    res.status(201).json({ comment: commentObj });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like/unlike a comment
router.post('/:id/like', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const isLiked = comment.isLikedBy(req.user.id);

    if (isLiked) {
      // Remove like
      comment.likes = comment.likes.filter(like => 
        like.user.toString() !== req.user.id
      );
    } else {
      // Add like
      comment.likes.push({ user: req.user.id });
      
      // Remove dislike if exists
      const isDisliked = comment.isDislikedBy(req.user.id);
      if (isDisliked) {
        comment.dislikes = comment.dislikes.filter(dislike => 
          dislike.user.toString() !== req.user.id
        );
      }
    }

    await comment.save();

    res.json({
      message: isLiked ? 'Like removed' : 'Comment liked',
      stats: comment.getStats(),
      isLiked: !isLiked,
      isDisliked: false
    });
  } catch (error) {
    console.error('Error liking comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dislike/remove dislike a comment
router.post('/:id/dislike', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const isDisliked = comment.isDislikedBy(req.user.id);

    if (isDisliked) {
      // Remove dislike
      comment.dislikes = comment.dislikes.filter(dislike => 
        dislike.user.toString() !== req.user.id
      );
    } else {
      // Add dislike
      comment.dislikes.push({ user: req.user.id });
      
      // Remove like if exists
      const isLiked = comment.isLikedBy(req.user.id);
      if (isLiked) {
        comment.likes = comment.likes.filter(like => 
          like.user.toString() !== req.user.id
        );
      }
    }

    await comment.save();

    res.json({
      message: isDisliked ? 'Dislike removed' : 'Comment disliked',
      stats: comment.getStats(),
      isLiked: false,
      isDisliked: !isDisliked
    });
  } catch (error) {
    console.error('Error disliking comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Edit a comment (only by author)
router.put('/:id', auth, async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    comment.content = content.trim();
    comment.isEdited = true;
    comment.editedAt = new Date();

    await comment.save();
    await comment.populate('author', 'username avatar');

    // Add stats to the response
    const commentObj = comment.toObject();
    
    // Convert _id to id for frontend compatibility
    commentObj.id = commentObj._id;
    delete commentObj._id;
    
    commentObj.stats = comment.getStats ? comment.getStats() : { likesCount: 0, dislikesCount: 0, repliesCount: 0 };
    commentObj.isLiked = req.user ? (comment.isLikedBy ? comment.isLikedBy(req.user.id) : false) : false;
    commentObj.isDisliked = req.user ? (comment.isDislikedBy ? comment.isDislikedBy(req.user.id) : false) : false;
    
    // Convert author _id to id
    if (commentObj.author && commentObj.author._id) {
      commentObj.author.id = commentObj.author._id;
      delete commentObj.author._id;
    }

    res.json({ comment: commentObj });
  } catch (error) {
    console.error('Error editing comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a comment (only by author or admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the author or admin
    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 