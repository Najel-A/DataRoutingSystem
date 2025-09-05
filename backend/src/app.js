const express = require('express');
const cors = require('cors');
const config = require('./config');
const { testConnection } = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const routingRoutes = require('./routes/routingRoutes');
const interviewerRoutes = require('./routes/interviewerRoutes');
const statsRoutes = require('./routes/statsRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors(config.cors));
app.use(express.json());

// Test database connection on startup
app.use(async (req, res, next) => {
  // Test database connection on first request
  if (!req.app.locals.dbChecked) {
    try {
      const connected = await testConnection();
      if (connected) {
        console.log('$$$ Database connection verified');
        req.app.locals.dbChecked = true;
      } else {
        console.log('$$$ Database connection failed - using fallback mode');
        req.app.locals.dbChecked = true;
      }
    } catch (error) {
      console.log('$$$ Database connection error:', error.message);
      req.app.locals.dbChecked = true;
    }
  }
  next();
});

// Routes
app.use('/api', userRoutes);
app.use('/api', routingRoutes);
app.use('/api', interviewerRoutes);
app.use('/api', statsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    architecture: 'modular'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
