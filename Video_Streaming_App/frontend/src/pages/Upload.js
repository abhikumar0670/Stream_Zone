import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadVideo, addYouTubeVideo } from '../store/slices/videoSlice';
import { toast } from 'react-toastify';

const Upload = () => {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'youtube'
  const [videoFile, setVideoFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Other',
    tags: '',
    visibility: 'public'
  });
  const [youtubeData, setYoutubeData] = useState({
    youtubeUrl: '',
    title: '',
    description: '',
    category: 'Other',
    tags: '',
    visibility: 'public'
  });

  const dispatch = useDispatch();
  const { loading, uploadProgress } = useSelector((state) => state.video);

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleYouTubeChange = (e) => {
    setYoutubeData({
      ...youtubeData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    if (activeTab === 'upload') {
      if (process.env.NODE_ENV === 'production') {
        toast.error('Video file uploads are not supported in production. Please use YouTube videos instead.');
        return;
      }
      
      if (!videoFile) {
        toast.error('Please select a video file');
        return;
      }

      const uploadData = new FormData();
      for (const key in formData) {
        uploadData.append(key, formData[key]);
      }
      uploadData.append('video', videoFile);

      dispatch(uploadVideo(uploadData)).then(() => {
        toast.success('Video uploaded successfully');
        setVideoFile(null);
        setFormData({
          title: '',
          description: '',
          category: 'Other',
          tags: '',
          visibility: 'public'
        });
      }).catch(error => {
        toast.error('Upload failed');
      });
    } else {
      if (!youtubeData.youtubeUrl) {
        toast.error('Please enter a YouTube URL');
        return;
      }

      dispatch(addYouTubeVideo(youtubeData)).then(() => {
        toast.success('YouTube video added successfully');
        setYoutubeData({
          youtubeUrl: '',
          title: '',
          description: '',
          category: 'Other',
          tags: '',
          visibility: 'public'
        });
      }).catch(error => {
        toast.error('Failed to add YouTube video');
      });
    }
  }, [dispatch, formData, videoFile, youtubeData, activeTab]);

  return (
    <div className="upload-container">
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Add Video</h2>
      
      {/* Tab Navigation */}
      <div className="tab-navigation" style={{ marginBottom: '20px' }}>
        <button
          type="button"
          className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            backgroundColor: activeTab === 'upload' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'upload' ? 'white' : '#333'
          }}
        >
          Upload File
        </button>
        <button
          type="button"
          className={`tab-button ${activeTab === 'youtube' ? 'active' : ''}`}
          onClick={() => setActiveTab('youtube')}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            backgroundColor: activeTab === 'youtube' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'youtube' ? 'white' : '#333'
          }}
        >
          Add YouTube Video
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {activeTab === 'upload' ? (
          <>
            {process.env.NODE_ENV === 'production' && (
              <div style={{ 
                backgroundColor: '#fff3cd', 
                border: '1px solid #ffeaa7', 
                borderRadius: '5px', 
                padding: '15px', 
                marginBottom: '20px',
                color: '#856404'
              }}>
                <strong>⚠️ Production Notice:</strong> Video file uploads are not supported in production mode. 
                Please use the "Add YouTube Video" tab instead, or implement cloud storage for file uploads.
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="video-file">Select Video File *</label>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                id="video-file"
                required
                disabled={process.env.NODE_ENV === 'production'}
              />
              {videoFile && (
                <div style={{ marginTop: '10px', color: '#666' }}>
                  <p>Selected: {videoFile.name}</p>
                  <p>Size: {(videoFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              )}
            </div>

            {uploadProgress > 0 && (
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Entertainment">Entertainment</option>
                <option value="Education">Education</option>
                <option value="Music">Music</option>
                <option value="Gaming">Gaming</option>
                <option value="Sports">Sports</option>
                <option value="News">News</option>
                <option value="Technology">Technology</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags (comma-separated)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g., funny, tutorial, gaming"
              />
            </div>

            <div className="form-group">
              <label htmlFor="visibility">Visibility</label>
              <select
                id="visibility"
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
              >
                <option value="public">Public</option>
                <option value="unlisted">Unlisted</option>
                <option value="private">Private</option>
              </select>
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label htmlFor="youtube-url">YouTube URL *</label>
              <input
                type="url"
                id="youtube-url"
                name="youtubeUrl"
                value={youtubeData.youtubeUrl}
                onChange={handleYouTubeChange}
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />
              <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                Supports YouTube watch URLs and youtu.be links
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="youtube-title">Title (optional - will use YouTube title if empty)</label>
              <input
                type="text"
                id="youtube-title"
                name="title"
                value={youtubeData.title}
                onChange={handleYouTubeChange}
                placeholder="Custom title (optional)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="youtube-description">Description (optional - will use YouTube description if empty)</label>
              <textarea
                id="youtube-description"
                name="description"
                value={youtubeData.description}
                onChange={handleYouTubeChange}
                rows="4"
                placeholder="Custom description (optional)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="youtube-category">Category</label>
              <select
                id="youtube-category"
                name="category"
                value={youtubeData.category}
                onChange={handleYouTubeChange}
              >
                <option value="Entertainment">Entertainment</option>
                <option value="Education">Education</option>
                <option value="Music">Music</option>
                <option value="Gaming">Gaming</option>
                <option value="Sports">Sports</option>
                <option value="News">News</option>
                <option value="Technology">Technology</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="youtube-tags">Tags (comma-separated)</label>
              <input
                type="text"
                id="youtube-tags"
                name="tags"
                value={youtubeData.tags}
                onChange={handleYouTubeChange}
                placeholder="e.g., funny, tutorial, gaming"
              />
            </div>

            <div className="form-group">
              <label htmlFor="youtube-visibility">Visibility</label>
              <select
                id="youtube-visibility"
                name="visibility"
                value={youtubeData.visibility}
                onChange={handleYouTubeChange}
              >
                <option value="public">Public</option>
                <option value="unlisted">Unlisted</option>
                <option value="private">Private</option>
              </select>
            </div>
          </>
        )}

        <button 
          type="submit" 
          className="btn" 
          disabled={loading || (activeTab === 'upload' && !videoFile) || (activeTab === 'youtube' && !youtubeData.youtubeUrl)}
        >
          {loading ? (activeTab === 'upload' ? 'Uploading...' : 'Adding...') : (activeTab === 'upload' ? 'Upload Video' : 'Add YouTube Video')}
        </button>
      </form>
    </div>
  );
};

export default Upload;
