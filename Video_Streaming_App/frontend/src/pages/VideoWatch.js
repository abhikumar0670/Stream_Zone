import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getVideo, likeVideo, dislikeVideo } from '../store/slices/videoSlice';
import { FaThumbsUp, FaThumbsDown, FaEye } from 'react-icons/fa';
import ReactPlayer from 'react-player';
import moment from 'moment';
import { toast } from 'react-toastify';
import CommentSection from '../components/CommentSection';

// Get API base URL
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://stream-zone-7vz7rkonw-abhishek-kumars-projects-1de91d80.vercel.app'
  : 'http://localhost:5000';

const VideoWatch = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentVideo, loading, error } = useSelector((state) => state.video);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getVideo(id));
  }, [dispatch, id]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like videos');
      return;
    }
    dispatch(likeVideo(id));
  };

  const handleDislike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to dislike videos');
      return;
    }
    dispatch(dislikeVideo(id));
  };

  const handleClose = () => {
    navigate('/');
  };

  if (loading) {
    return <div className="loading">Loading video...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!currentVideo) {
    return <div className="error">Video not found</div>;
  }

  // const isYouTube = currentVideo.videoType === 'youtube';
  // const thumbnail = isYouTube ? null : currentVideo.thumbnail;

  return (
    <div className="container">
      <div className="video-player-container" style={{ position: 'relative' }}>
        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 10,
            background: 'rgba(0,0,0,0.6)',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: 36,
            height: 36,
            fontSize: 22,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
          }}
          aria-label="Close video"
          title="Close"
        >
          ×
        </button>
        {currentVideo.videoType === 'youtube' ? (
          <ReactPlayer
            url={currentVideo.videoUrl}
            className="video-player"
            controls
            width="100%"
            height="450px"
            config={{
              youtube: {
                playerVars: {
                  origin: window.location.origin,
                  modestbranding: 1,
                  rel: 0
                }
              }
            }}
          />
        ) : (
          <div style={{ 
            width: '100%', 
            height: '450px', 
            backgroundColor: '#f0f0f0', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            textAlign: 'center',
            padding: '20px'
          }}>
            <h3>Video Player</h3>
            <p>This video was uploaded directly to the platform.</p>
            {process.env.NODE_ENV === 'production' ? (
              <div>
                <p style={{ color: '#e74c3c', marginBottom: '10px' }}>
                  ⚠️ Video streaming is not available in production mode.
                </p>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>
                  Please use YouTube videos for production deployment, or implement cloud storage for uploaded videos.
                </p>
              </div>
            ) : (
              <ReactPlayer
                url={`${API_URL}${currentVideo.videoUrl}`}
                className="video-player"
                controls
                width="100%"
                height="450px"
              />
            )}
          </div>
        )}
        {/* Video details card for theme styling */}
        <div className="video-details-card">
          <div className="video-details">
            <h1>{currentVideo.title}</h1>
            <div className="video-stats" style={{ margin: '10px 0' }}>
              <span><FaEye /> {currentVideo.views} views</span>
              <span> • {moment(currentVideo.createdAt).fromNow()}</span>
              {currentVideo.videoType === 'youtube' && (
                <span style={{ marginLeft: '10px', color: '#666' }}>
                  • YouTube Video
                </span>
              )}
            </div>
            <div className="video-actions">
              <button 
                className={currentVideo.isLiked ? 'liked' : ''} 
                onClick={handleLike}
              >
                <FaThumbsUp /> {currentVideo.stats.likesCount}
              </button>
              <button 
                className={currentVideo.isDisliked ? 'disliked' : ''} 
                onClick={handleDislike}
              >
                <FaThumbsDown /> {currentVideo.stats.dislikesCount}
              </button>
            </div>
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <strong>{currentVideo.uploader.username}</strong>
                <span style={{ marginLeft: '10px', color: '#666' }}>
                  {currentVideo.uploader.subscribersCount} subscribers
                </span>
              </div>
              {currentVideo.description && (
                <div style={{ marginTop: '15px' }}>
                  <h3>Description</h3>
                  <p style={{ marginTop: '10px', lineHeight: '1.6' }}>
                    {currentVideo.description}
                  </p>
                </div>
              )}
              {currentVideo.tags && currentVideo.tags.length > 0 && (
                <div style={{ marginTop: '15px' }}>
                  <h3>Tags</h3>
                  <div style={{ marginTop: '10px' }}>
                    {currentVideo.tags.map((tag, index) => (
                      <span
                        key={index}
                        style={{
                          display: 'inline-block',
                          background: '#f0f0f0',
                          padding: '5px 10px',
                          borderRadius: '15px',
                          marginRight: '10px',
                          marginBottom: '5px',
                          fontSize: '0.9rem'
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Comments Section */}
      <CommentSection videoId={id} />
    </div>
  );
};

export default VideoWatch;
