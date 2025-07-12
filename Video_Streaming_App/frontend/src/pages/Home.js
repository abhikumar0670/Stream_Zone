import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getVideos, deleteVideo } from '../store/slices/videoSlice';
import moment from 'moment';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';

const getYouTubeThumbnail = (url) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
};

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { videos, loading, error } = useSelector((state) => state.video);
  const { user } = useSelector((state) => state.auth);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        await dispatch(getVideos()).unwrap();
      } catch (error) {
        console.error('Failed to fetch videos:', error);
        // You could set some fallback data here if needed
      }
    };
    fetchVideos();
  }, [dispatch]);

  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  const handleDelete = async (e, videoId) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    setDeletingId(videoId);
    try {
      await dispatch(deleteVideo(videoId)).unwrap();
      toast.success('Video deleted successfully');
    } catch (err) {
      toast.error('Failed to delete video');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="loading">Loading videos...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          margin: '20px 0'
        }}>
          <h2 style={{ color: '#dc3545', marginBottom: '16px' }}>Connection Error</h2>
          <p style={{ color: '#6c757d', marginBottom: '20px' }}>
            {error === 'Failed to fetch videos' 
              ? 'Unable to connect to the server. The backend API might not be responding.'
              : error
            }
          </p>
          <button 
            onClick={() => {
              dispatch(getVideos());
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Try Again
          </button>
          <div style={{ marginTop: '20px', fontSize: '14px', color: '#6c757d' }}>
            <p><strong>Troubleshooting:</strong></p>
            <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
              <li>Check your internet connection</li>
              <li>The backend server might be starting up (please wait a moment)</li>
              <li>Database connection might be initializing</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', margin: '32px 0 18px 0', fontWeight: 800, letterSpacing: '0.01em' }}>Latest Videos</h1>
      <div className="video-grid">
        {videos.map((video) => {
          const canDelete = user && (user.role === 'admin' || user.id === video.uploader.id);
          let thumbnail = '';
          if (video.videoType === 'youtube') {
            thumbnail = getYouTubeThumbnail(video.videoUrl);
          } else if (video.thumbnail) {
            thumbnail = video.thumbnail;
          }
          return (
            <div
              key={video.id}
              className="video-card"
              onClick={() => handleVideoClick(video.id)}
              tabIndex={0}
              role="button"
              aria-label={`Open video: ${video.title}`}
            >
              <div className="video-thumbnail-container">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={video.title}
                    className="video-thumbnail"
                    onError={e => { e.target.onerror = null; e.target.src = '/placeholder-thumb.svg'; }}
                  />
                ) : (
                  <span className="placeholder-icon" role="img" aria-label="video">
                    {video.videoType === 'youtube' ? '🎥' : '📹'}
                  </span>
                )}
                {video.videoType === 'youtube' && (
                  <div className="youtube-badge">YT</div>
                )}
                {canDelete && (
                  <button
                    className="delete-video-btn"
                    disabled={deletingId === video.id}
                    onClick={e => handleDelete(e, video.id)}
                    aria-label="Delete video"
                    title="Delete video"
                  >
                    {deletingId === video.id ? (
                      <span style={{ fontSize: '0.9rem' }}>...</span>
                    ) : (
                      <FaTrash style={{ fontSize: '1.1rem' }} />
                    )}
                  </button>
                )}
              </div>
              <div className="video-info">
                <h3 className="video-title">{video.title}</h3>
                <p className="video-uploader">By {video.uploader.username}</p>
                <div className="video-stats">
                  <span>{video.views} views</span>
                  <span>{moment(video.createdAt).fromNow()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {videos.length === 0 && (
        <div style={{ textAlign: 'center', margin: '40px 0' }}>
          <p>No videos available. Be the first to upload!</p>
        </div>
      )}
    </div>
  );
};

export default Home;
