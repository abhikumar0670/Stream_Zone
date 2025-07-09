import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getVideos } from '../store/slices/videoSlice';
import moment from 'moment';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { videos, loading, error } = useSelector((state) => state.video);

  useEffect(() => {
    dispatch(getVideos());
  }, [dispatch]);

  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  if (loading) {
    return <div className="loading">Loading videos...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', margin: '20px 0' }}>Latest Videos</h1>
      
      <div className="video-grid">
        {videos.map((video) => (
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
              <p className="video-uploader">By {video.uploader.username}</p>
              <div className="video-stats">
                <span>{video.views} views</span>
                <span>{moment(video.createdAt).fromNow()}</span>
              </div>
            </div>
          </div>
        ))}
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
