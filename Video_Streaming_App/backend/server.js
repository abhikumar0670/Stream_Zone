const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const connectDB = require('./utils/database');
const { auth } = require('./middleware/auth');
require('dotenv').config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://stream-zone-189oh9gh6-abhishek-kumars-projects-1de91d80.vercel.app']
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(morgan('dev'));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Welcome Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Video Streaming Platform API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Health Check Route
app.get('/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState;
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  res.json({
    status: 'ok',
    database: {
      status: dbStates[dbStatus],
      name: mongoose.connection.name || 'N/A'
    },
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/videos', require('./routes/videos'));

// Serve static files
app.use('/uploads', express.static('uploads'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
