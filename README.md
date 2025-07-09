# Video Streaming Backend

A Node.js backend for a video streaming platform built with Express.js and MongoDB Atlas.

## Features

- 🎥 Video upload and streaming
- 🔐 User authentication with JWT
- 📱 RESTful API design
- 🗄️ MongoDB Atlas database
- 🚀 Ready for deployment on Vercel
- 📊 Health check endpoint
- 🔒 Security middleware (Helmet, CORS)
- 📝 Request logging with Morgan

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Security**: Helmet, CORS, bcryptjs
- **Deployment**: Vercel

## API Endpoints

### General
- `GET /` - Welcome message
- `GET /health` - Health check with database status

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Videos
- `GET /api/videos` - Get all videos
- `POST /api/videos` - Upload a new video
- `GET /api/videos/:id` - Get video by ID
- `PUT /api/videos/:id` - Update video
- `DELETE /api/videos/:id` - Delete video

## Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
NODE_ENV=development
PORT=5000
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
MAX_FILE_SIZE=500000000
UPLOAD_PATH=./uploads
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables
4. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment

This project is configured for deployment on Vercel with the included `vercel.json` configuration.

## Project Structure

```
├── controllers/
│   ├── authController.js
│   └── videoController.js
├── middleware/
│   ├── auth.js
│   └── upload.js
├── models/
│   ├── User.js
│   ├── Video.js
│   └── Comment.js
├── routes/
│   ├── auth.js
│   └── videos.js
├── utils/
│   ├── database.js
│   └── jwt.js
├── server.js
└── package.json
```

## Author

Abhishek Kumar

## License

MIT
