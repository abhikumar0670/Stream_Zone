import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserVideos } from '../store/slices/videoSlice';
import moment from 'moment';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { userVideos, loading } = useSelector((state) => state.video);

  useEffect(() => {
    dispatch(getUserVideos());
  }, [dispatch]);

  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

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
          <div style={{ marginTop: '20px' }}>
            <p><strong>Username:</strong> {user?.username}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Member since:</strong> {moment(user?.createdAt).format('MMMM YYYY')}</p>
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
