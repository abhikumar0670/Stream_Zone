import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getVideo, likeVideo, dislikeVideo } from '../store/slices/videoSlice';
import { FaThumbsUp, FaThumbsDown, FaEye } from 'react-icons/fa';
import ReactPlayer from 'react-player';
import moment from 'moment';
import { toast } from 'react-toastify';

const VideoWatch = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
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

  if (loading) {
    return <div className="loading">Loading video...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!currentVideo) {
    return <div className="error">Video not found</div>;
  }

  return (
    <div className="container">
      <div className="video-player-container">
        <ReactPlayer
          url={`http://localhost:5000${currentVideo.videoUrl}`}
          className="video-player"
          controls
          width="100%"
          height="450px"
        />
        
        <div className="video-details">
          <h1>{currentVideo.title}</h1>
          
          <div className="video-stats" style={{ margin: '10px 0' }}>
            <span><FaEye /> {currentVideo.views} views</span>
            <span> • {moment(currentVideo.createdAt).fromNow()}</span>
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
  );
};

export default VideoWatch;
