# StreamZone

A modern full-stack video streaming platform with YouTube-like features, built with React, Node.js/Express, and MongoDB.

## Features

- **User Authentication**: Register, login, and manage your profile with avatar upload.
- **Video Upload**: Upload local video files (dev only) or add YouTube videos.
- **Video Management**: Delete your own videos, see view counts, and manage tags.
- **Thumbnails**: Automatic thumbnail generation for local uploads, YouTube thumbnails for YouTube videos.
- **Comments**: Nested comments with replies, like/dislike, edit, and delete. Modern, theme-aware UI.
- **Likes/Dislikes**: Like/dislike videos and comments, with instant UI updates.
- **Profile Page**: View and edit your profile, upload a profile photo, and see your uploaded videos.
- **Dark/Light Mode**: Toggle between beautiful dark and light themes. All UI elements are theme-aware and accessible.
- **Responsive Design**: Works great on desktop and mobile.
- **Modern UI/UX**: Smooth animations, gold/blue branding, accessible, and visually polished.

## Tech Stack
- **Frontend**: React, Redux, CSS
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Video Processing**: ffmpeg (for thumbnails)

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB (local or Atlas)
- ffmpeg (for local video thumbnail generation)

### Backend Setup
```bash
cd backend
npm install
# Create a .env file with your MongoDB URI and JWT secret
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Environment Variables
- Backend: `.env` with `MONGO_URI` and `JWT_SECRET`
- Frontend: No special env needed for local dev

## Usage
- Register and login to your account
- Upload a video or add a YouTube video
- Like, comment, and reply on videos
- Manage your profile and see your uploaded videos
- Toggle dark/light mode from the navbar

## Deployment
- See `backend/DEPLOYMENT.md` for deployment notes
- For production, use YouTube videos or set up cloud storage for uploads

## Screenshots
- ![Light Mode](screenshots/light-mode.png)
- ![Dark Mode](screenshots/dark-mode.png)

## License
MIT
