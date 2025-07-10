const axios = require('axios');

// Extract YouTube video ID from various YouTube URL formats
const extractYouTubeId = (url) => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/watch\?.*&v=)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return null;
};

// Fetch YouTube video metadata using oEmbed API
const getYouTubeMetadata = async (videoId) => {
  try {
    const response = await axios.get(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    
    return {
      title: response.data.title,
      description: response.data.description || '',
      thumbnail: response.data.thumbnail_url,
      author: response.data.author_name,
      authorUrl: response.data.author_url,
      duration: null // oEmbed doesn't provide duration
    };
  } catch (error) {
    console.error('Error fetching YouTube metadata:', error.message);
    throw new Error('Failed to fetch YouTube video metadata');
  }
};

// Validate YouTube URL
const isValidYouTubeUrl = (url) => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
  return youtubeRegex.test(url);
};

module.exports = {
  extractYouTubeId,
  getYouTubeMetadata,
  isValidYouTubeUrl
}; 