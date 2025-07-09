import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { videoAPI } from '../../services/api';

// Async thunks
export const getVideos = createAsyncThunk(
  'video/getVideos',
  async (params, { rejectWithValue }) => {
    try {
      const response = await videoAPI.getVideos(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch videos');
    }
  }
);

export const getVideo = createAsyncThunk(
  'video/getVideo',
  async (id, { rejectWithValue }) => {
    try {
      const response = await videoAPI.getVideo(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch video');
    }
  }
);

export const uploadVideo = createAsyncThunk(
  'video/uploadVideo',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await videoAPI.uploadVideo(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload video');
    }
  }
);

export const getUserVideos = createAsyncThunk(
  'video/getUserVideos',
  async (params, { rejectWithValue }) => {
    try {
      const response = await videoAPI.getUserVideos(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user videos');
    }
  }
);

export const likeVideo = createAsyncThunk(
  'video/likeVideo',
  async (id, { rejectWithValue }) => {
    try {
      const response = await videoAPI.likeVideo(id);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to like video');
    }
  }
);

export const dislikeVideo = createAsyncThunk(
  'video/dislikeVideo',
  async (id, { rejectWithValue }) => {
    try {
      const response = await videoAPI.dislikeVideo(id);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to dislike video');
    }
  }
);

export const deleteVideo = createAsyncThunk(
  'video/deleteVideo',
  async (id, { rejectWithValue }) => {
    try {
      await videoAPI.deleteVideo(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete video');
    }
  }
);

const videoSlice = createSlice({
  name: 'video',
  initialState: {
    videos: [],
    currentVideo: null,
    userVideos: [],
    loading: false,
    error: null,
    pagination: {
      current: 1,
      total: 0,
      hasNext: false,
      hasPrev: false,
    },
    uploadProgress: 0,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentVideo: (state) => {
      state.currentVideo = null;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Videos
      .addCase(getVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload.videos;
        state.pagination = action.payload.pagination;
      })
      .addCase(getVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Video
      .addCase(getVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVideo = action.payload.video;
      })
      .addCase(getVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upload Video
      .addCase(uploadVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(uploadVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadProgress = 100;
        state.videos.unshift(action.payload.video);
      })
      .addCase(uploadVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.uploadProgress = 0;
      })
      // Get User Videos
      .addCase(getUserVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.userVideos = action.payload.videos;
        state.pagination = action.payload.pagination;
      })
      .addCase(getUserVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Like Video
      .addCase(likeVideo.fulfilled, (state, action) => {
        if (state.currentVideo && state.currentVideo.id === action.payload.id) {
          state.currentVideo.isLiked = action.payload.isLiked;
          state.currentVideo.isDisliked = action.payload.isDisliked;
          state.currentVideo.stats = action.payload.stats;
        }
      })
      // Dislike Video
      .addCase(dislikeVideo.fulfilled, (state, action) => {
        if (state.currentVideo && state.currentVideo.id === action.payload.id) {
          state.currentVideo.isLiked = action.payload.isLiked;
          state.currentVideo.isDisliked = action.payload.isDisliked;
          state.currentVideo.stats = action.payload.stats;
        }
      })
      // Delete Video
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.videos = state.videos.filter(video => video.id !== action.payload);
        state.userVideos = state.userVideos.filter(video => video.id !== action.payload);
      });
  },
});

export const { clearError, clearCurrentVideo, setUploadProgress } = videoSlice.actions;
export default videoSlice.reducer;
