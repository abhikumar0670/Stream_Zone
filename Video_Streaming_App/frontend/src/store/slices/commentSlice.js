import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { commentAPI } from '../../services/api';

// Async thunks
export const getComments = createAsyncThunk(
  'comment/getComments',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await commentAPI.getComments(videoId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
    }
  }
);

export const addComment = createAsyncThunk(
  'comment/addComment',
  async (commentData, { rejectWithValue }) => {
    try {
      const response = await commentAPI.addComment(commentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
    }
  }
);

export const editComment = createAsyncThunk(
  'comment/editComment',
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const response = await commentAPI.editComment(commentId, content);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to edit comment');
    }
  }
);

export const likeComment = createAsyncThunk(
  'comment/likeComment',
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await commentAPI.likeComment(commentId);
      return { commentId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to like comment');
    }
  }
);

export const dislikeComment = createAsyncThunk(
  'comment/dislikeComment',
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await commentAPI.dislikeComment(commentId);
      return { commentId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to dislike comment');
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comment/deleteComment',
  async (commentId, { rejectWithValue }) => {
    try {
      await commentAPI.deleteComment(commentId);
      return commentId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete comment');
    }
  }
);

const commentSlice = createSlice({
  name: 'comment',
  initialState: {
    comments: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearComments: (state) => {
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Comments
      .addCase(getComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload.comments;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Comment
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        const newComment = action.payload.comment;
        
        if (newComment.parentComment) {
          // This is a reply, add it to the parent comment's replies
          const parentComment = state.comments.find(c => c.id === newComment.parentComment);
          if (parentComment) {
            if (!parentComment.replies) {
              parentComment.replies = [];
            }
            parentComment.replies.unshift(newComment);
            // Update parent comment's stats
            if (parentComment.stats) {
              parentComment.stats.repliesCount = (parentComment.stats.repliesCount || 0) + 1;
            }
          }
        } else {
          // This is a top-level comment
          state.comments.unshift(newComment);
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Edit Comment
      .addCase(editComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editComment.fulfilled, (state, action) => {
        state.loading = false;
        const updatedComment = action.payload.comment;
        
        // Find comment in top-level comments
        let index = state.comments.findIndex(c => c.id === updatedComment.id);
        
        // If not found in top-level, search in replies
        if (index === -1) {
          for (let i = 0; i < state.comments.length; i++) {
            const topComment = state.comments[i];
            if (topComment.replies) {
              const replyIndex = topComment.replies.findIndex(r => r.id === updatedComment.id);
              if (replyIndex !== -1) {
                topComment.replies[replyIndex] = updatedComment;
                break;
              }
            }
          }
        } else {
          state.comments[index] = updatedComment;
        }
      })
      .addCase(editComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Like Comment
      .addCase(likeComment.fulfilled, (state, action) => {
        // Find comment in top-level comments
        let comment = state.comments.find(c => c.id === action.payload.commentId);
        
        // If not found in top-level, search in replies
        if (!comment) {
          for (const topComment of state.comments) {
            if (topComment.replies) {
              comment = topComment.replies.find(r => r.id === action.payload.commentId);
              if (comment) break;
            }
          }
        }
        
        if (comment) {
          comment.isLiked = action.payload.isLiked;
          comment.isDisliked = action.payload.isDisliked;
          comment.stats = action.payload.stats;
        }
      })
      // Dislike Comment
      .addCase(dislikeComment.fulfilled, (state, action) => {
        // Find comment in top-level comments
        let comment = state.comments.find(c => c.id === action.payload.commentId);
        
        // If not found in top-level, search in replies
        if (!comment) {
          for (const topComment of state.comments) {
            if (topComment.replies) {
              comment = topComment.replies.find(r => r.id === action.payload.commentId);
              if (comment) break;
            }
          }
        }
        
        if (comment) {
          comment.isLiked = action.payload.isLiked;
          comment.isDisliked = action.payload.isDisliked;
          comment.stats = action.payload.stats;
        }
      })
      // Delete Comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        const commentId = action.payload;
        
        // Remove from top-level comments
        state.comments = state.comments.filter(comment => comment.id !== commentId);
        
        // Remove from replies
        for (const topComment of state.comments) {
          if (topComment.replies) {
            topComment.replies = topComment.replies.filter(reply => reply.id !== commentId);
          }
        }
      });
  },
});

export const { clearError, clearComments } = commentSlice.actions;
export default commentSlice.reducer; 