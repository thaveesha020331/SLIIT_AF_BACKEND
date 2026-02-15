/**
 * Server Integration Guide for Product Management System
 * 
 * Add this to your Server.js or main application file
 */

// ==========================================
// EXAMPLE SERVER.JS CONFIGURATION
// ==========================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/Lakna/productRoutes.js';

dotenv.config();
const app = express();

// ==========================================
// MIDDLEWARE SETUP
// ==========================================

// CORS Configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Static Files for Image Upload
app.use('/uploads', express.static('uploads'));

// ==========================================
// DATABASE CONNECTION
// ==========================================

connectDB();

// ==========================================
// ROUTES SETUP
// ==========================================

// Product Management Routes
app.use('/api/products', productRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// ERROR HANDLING MIDDLEWARE
// ==========================================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Multer file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      status: 'error',
      message: 'File size exceeds limit (5MB)',
    });
  }

  if (err.message.includes('Invalid file type')) {
    return res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }

  // MongoDB validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.keys(err.errors).reduce((acc, key) => {
      acc[key] = err.errors[key].message;
      return acc;
    }, {});

    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors,
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error',
  });
});

// ==========================================
// SERVER STARTUP
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ API Base URL: http://localhost:${PORT}/api`);
  console.log(`✓ Products Endpoint: http://localhost:${PORT}/api/products`);
});

export default app;

// ==========================================
// EXAMPLE SETUP WITH EXISTING ROUTES
// ==========================================

/*
// If you already have other routes, add product routes like this:

import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/Lakna/productRoutes.js';

// Register all routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);  // Add this line

// Rest of server configuration...
*/

// ==========================================
// EXAMPLE ENV FILE (.env)
// ==========================================

/*
# Database
MONGODB_URI=mongodb://localhost:27017/sliit_af_db

# Server
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000

# File Upload
MAX_FILE_SIZE=5242880

# Third-Party APIs
CARBON_API_TIMEOUT=5000
*/

// ==========================================
// FRONTEND AXIOS CONFIGURATION
// ==========================================

/*
// Example axios setup in React component

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

export default api;

// Usage in component:
// import api from './api/axios';
// const response = await api.get('/products');
*/

// ==========================================
// UPLOAD DIRECTORY SETUP
// ==========================================

/*
// Create uploads directory if it doesn't exist
// Add this to your server startup:

import fs from 'fs';
import path from 'path';

const uploadDir = path.join(process.cwd(), 'uploads', 'products');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✓ Upload directory created');
}
*/

// ==========================================
// EXAMPLE FRONTEND .env FILE
// ==========================================

/*
REACT_APP_API_URL=http://localhost:5000/api
*/
