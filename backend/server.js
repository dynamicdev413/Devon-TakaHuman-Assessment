const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Connect to MongoDB and start server only if not in test mode
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/notesapp';

// Only start server if not in test environment and this file is run directly
if (process.env.NODE_ENV !== 'test' && require.main === module) {
  // Check if already connected
  if (mongoose.connection.readyState === 0) {
    mongoose.connect(MONGODB_URI)
      .then(() => {
        console.log('Connected to MongoDB');
        const server = app.listen(PORT, () => {
          console.log(`Server running on port ${PORT}`);
        });
        
        // Graceful shutdown
        process.on('SIGTERM', () => {
          server.close(() => {
            mongoose.connection.close();
            process.exit(0);
          });
        });
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1);
      });
  }
}

module.exports = app;

