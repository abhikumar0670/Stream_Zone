import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserVideos } from '../store/slices/videoSlice';
import { getMe } from '../store/slices/authSlice';
import moment from 'moment';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://stream-zone-7vz7rkonw-abhishek-kumars-projects-1de91d80.vercel.app/api'
  : 'http://localhost:5000/api';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { userVideos, loading } = useSelector((state) => state.video);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    dispatch(getUserVideos());
  }, [dispatch]);

  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarUpload = async (e) => {
    e.preventDefault();
    const file = fileInputRef.current.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/auth/avatar`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setAvatarPreview(null);
      dispatch(getMe()); // Refresh user info
    } catch (err) {
      alert('Failed to upload avatar');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  const avatarUrl = avatarPreview
    || (user?.avatar ? `/uploads/images/${user.avatar}` : null);

  return (
    <div className="container">
      <div style={{ padding: '20px' }}>
        <div style={{ 
          background: 'white', 
          padding: '30px', 
          borderRadius: '8px', 
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h1>Profile</h1>
          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div>
              <div className="profile-avatar-wrapper">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile avatar"
                    className="profile-avatar"
                  />
                ) : (
                  <div className="profile-avatar profile-avatar-placeholder">
                    <span role="img" aria-label="avatar" style={{ fontSize: 38 }}>
                      👤
                    </span>
                  </div>
                )}
              </div>
              <form onSubmit={handleAvatarUpload} style={{ marginTop: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                />
                <button
                  type="button"
                  className="btn"
                  style={{ minWidth: 120, marginBottom: 4 }}
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  disabled={uploading}
                >
                  Choose Photo
                </button>
                {avatarPreview && (
                  <button
                    type="submit"
                    className="btn"
                    style={{ minWidth: 120 }}
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Upload Photo'}
                  </button>
                )}
              </form>
            </div>
            <div>
              <p><strong>Username:</strong> {user?.username}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Member since:</strong> {moment(user?.createdAt).format('MMMM YYYY')}</p>
            </div>
          </div>
        </div>

        <div style={{ 
          background: 'white', 
          padding: '30px', 
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2>My Videos ({userVideos.length})</h2>
          {userVideos.length > 0 ? (
            <div className="video-grid">
              {userVideos.map((video) => (
                <div
                  key={video.id}
                  className="video-card"
                  onClick={() => handleVideoClick(video.id)}
                >
                  <img
                    src={video.thumbnail || '/default-thumbnail.jpg'}
                    alt={video.title}
                    className="video-thumbnail"
                  />
                  <div className="video-info">
                    <h3 className="video-title">{video.title}</h3>
                    <div className="video-stats">
                      <span>{video.views} views</span>
                      <span>{moment(video.createdAt).fromNow()}</span>
                    </div>
                    <div style={{ marginTop: '10px' }}>
                      <span style={{ 
                        background: video.visibility === 'public' ? '#4CAF50' : '#ff9800',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8rem'
                      }}>
                        {video.visibility}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', margin: '40px 0' }}>
              <p>You haven't uploaded any videos yet.</p>
              <button 
                className="btn" 
                onClick={() => navigate('/upload')}
                style={{ marginTop: '20px' }}
              >
                Upload Your First Video
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
