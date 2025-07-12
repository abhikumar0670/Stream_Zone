import axios from 'axios';

// Dynamic API URL based on environment
const API_URL = process.env.REACT_APP_API_URL || (
  process.env.NODE_ENV === 'production' 
    ? 'https://stream-zone-l98tzxpxa-abhishek-kumars-projects-1de91d80.vercel.app/api'
    : 'http://localhost:5000/api'
);

console.log('API URL:', API_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
};

// Video endpoints
export const videoAPI = {
  getVideos: (params) => api.get('/videos', { params }),
  getVideo: (id) => api.get(`/videos/${id}`),
  uploadVideo: (formData) => api.post('/videos/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  addYouTubeVideo: (videoData) => api.post('/videos/youtube', videoData),
  getUserVideos: (params) => api.get('/videos/user/videos', { params }),
  streamVideo: (id) => `${API_URL}/videos/stream/${id}`,
  likeVideo: (id) => api.post(`/videos/${id}/like`),
  dislikeVideo: (id) => api.post(`/videos/${id}/dislike`),
  deleteVideo: (id) => api.delete(`/videos/${id}`),
};

// Comment endpoints
export const commentAPI = {
  getComments: (videoId) => api.get(`/comments/video/${videoId}`),
  addComment: (commentData) => api.post('/comments', commentData),
  editComment: (id, content) => api.put(`/comments/${id}`, { content }),
  likeComment: (id) => api.post(`/comments/${id}/like`),
  dislikeComment: (id) => api.post(`/comments/${id}/dislike`),
  deleteComment: (id) => api.delete(`/comments/${id}`),
};

export default api;
