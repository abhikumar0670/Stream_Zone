# 🎬 Stream Zone - Full-Stack Video Streaming Platform

A modern, full-stack video streaming platform built with React.js frontend and Node.js backend, deployed on Vercel.

## 🚀 Live Demo
- **Frontend**: https://stream-zone-189oh9gh6-abhishek-kumars-projects-1de91d80.vercel.app
- **Backend API**: https://stream-zone-189oh9gh6-abhishek-kumars-projects-1de91d80.vercel.app/api
- **Health Check**: https://stream-zone-189oh9gh6-abhishek-kumars-projects-1de91d80.vercel.app/health

## 📋 Features

### Frontend Features
- 🎥 **Video Streaming**: Watch videos with responsive player
- 🔐 **User Authentication**: Register, login, and profile management
- 📱 **Responsive Design**: Works on all devices
- 🎨 **Modern UI**: Clean and intuitive interface
- 🔍 **Search & Filter**: Find videos by category, title, or uploader
- 👍 **Like/Dislike**: Rate videos and provide feedback
- 📊 **User Dashboard**: Manage uploaded videos and view stats
- 💬 **Comments**: Comment on videos (coming soon)

### Backend Features
- 🛡️ **Secure Authentication**: JWT-based auth system
- 🎬 **Video Management**: Upload, stream, and manage videos
- 📊 **Video Analytics**: View counts, likes, and engagement metrics
- 🗄️ **Database**: MongoDB Atlas integration
- 🔒 **Security**: Helmet, CORS, and rate limiting
- 📁 **File Upload**: Multer for video file handling
- 🚀 **Scalable**: Serverless deployment on Vercel
- 📝 **API Documentation**: RESTful API endpoints

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js 18
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Styling**: CSS3 with responsive design
- **HTTP Client**: Axios
- **Video Player**: React Player
- **Forms**: React Hook Form
- **Notifications**: React Toastify
- **Icons**: React Icons

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Security**: Helmet, CORS, bcryptjs
- **Validation**: Express Validator
- **Logging**: Morgan
- **Compression**: Compression middleware

### Deployment
- **Platform**: Vercel
- **Database**: MongoDB Atlas
- **Storage**: Local file system (Vercel Functions)
- **CI/CD**: GitHub integration

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- MongoDB Atlas account
- Git installed

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/abhikumar0670/Stream_Zone.git
   cd Stream_Zone
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Variables**
   
   Create `.env` file in the `backend` directory:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   NODE_ENV=development
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   MAX_FILE_SIZE=500000000
   UPLOAD_PATH=./uploads
   ```

5. **Run the Application**
   
   Terminal 1 (Backend):
   ```bash
   cd backend
   npm run dev
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd frontend
   npm start
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - Health Check: http://localhost:5000/health

## 📁 Project Structure

```
Stream_Zone/
├── frontend/                 # React.js frontend
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── store/           # Redux store
│   │   └── ...
│   ├── package.json
│   └── ...
├── backend/                  # Node.js backend
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   ├── uploads/            # File uploads
│   ├── server.js           # Main server file
│   └── package.json
├── vercel.json              # Vercel configuration
├── README.md
└── .gitignore
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Videos
- `GET /api/videos` - Get all videos (with pagination)
- `GET /api/videos/:id` - Get video by ID
- `POST /api/videos/upload` - Upload new video
- `GET /api/videos/user/videos` - Get user's videos
- `POST /api/videos/:id/like` - Like/unlike video
- `POST /api/videos/:id/dislike` - Dislike video
- `GET /api/videos/stream/:id` - Stream video
- `DELETE /api/videos/:id` - Delete video

### General
- `GET /` - Welcome message
- `GET /health` - Health check with database status

## 🔧 Configuration

### Frontend Configuration
The frontend automatically detects the environment and uses the appropriate API URL:
- **Development**: `http://localhost:5000/api`
- **Production**: `https://stream-zone-189oh9gh6-abhishek-kumars-projects-1de91d80.vercel.app/api`

### Backend Configuration
Environment variables needed for the backend:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 5000)

## 🚀 Deployment

### Vercel Deployment
The project is configured for automatic deployment on Vercel:

1. **Fork the repository** on GitHub
2. **Connect to Vercel** and import the project
3. **Set environment variables** in Vercel dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
4. **Deploy** - Vercel will automatically build and deploy

### Manual Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel --prod
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password encryption
- **CORS Protection**: Configured for specific origins
- **Helmet**: Security headers middleware
- **Input Validation**: Express validator for request validation
- **Rate Limiting**: Protection against brute force attacks

## 📱 Features in Development

- [ ] **Comments System**: Add and manage video comments
- [ ] **Subscriptions**: Subscribe to channels
- [ ] **Notifications**: Real-time notifications
- [ ] **Live Streaming**: Live video streaming capability
- [ ] **Video Processing**: Automatic video optimization
- [ ] **Advanced Search**: Full-text search with filters
- [ ] **Analytics Dashboard**: Detailed video analytics
- [ ] **Mobile App**: React Native mobile application

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Abhishek Kumar**
- GitHub: [@abhikumar0670](https://github.com/abhikumar0670)
- Email: [your-email@example.com](mailto:your-email@example.com)

## 🙏 Acknowledgments

- Thanks to all contributors and open-source libraries
- Special thanks to the React and Node.js communities
- Vercel for providing excellent deployment platform
- MongoDB Atlas for database hosting

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/abhikumar0670/Stream_Zone/issues) page
2. Create a new issue if your problem isn't already reported
3. Contact the maintainer for urgent issues

---

**Made with ❤️ by Abhishek Kumar**
