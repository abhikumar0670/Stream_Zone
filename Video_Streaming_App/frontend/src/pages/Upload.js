import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadVideo } from '../store/slices/videoSlice';
import { toast } from 'react-toastify';

const Upload = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [formData, setFormData] = useState({
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

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

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
  }, [dispatch, formData, videoFile]);

  return (
    <div className="upload-container">
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Upload Video</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="video-file">Select Video File *</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            id="video-file"
            required
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

        <button type="submit" className="btn" disabled={loading || !videoFile}>
          {loading ? 'Uploading...' : 'Upload Video'}
        </button>
      </form>
    </div>
  );
};

export default Upload;
