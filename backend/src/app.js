const express = require('express');
const cors = require('cors');
const config = require('./config');
const { generateSyntheticUsers, initializeInterviewers } = require('./data/generators');
const userRoutes = require('./routes/userRoutes');
const routingRoutes = require('./routes/routingRoutes');
const interviewerRoutes = require('./routes/interviewerRoutes');
const statsRoutes = require('./routes/statsRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors(config.cors));
app.use(express.json());

// Initialize data
app.use((req, res, next) => {
  // Initialize data on first request if not already done
  if (!req.app.locals.initialized) {
    generateSyntheticUsers(config.data.userCount);
    initializeInterviewers(config.data.interviewerCount);
    req.app.locals.initialized = true;
    console.log(`📊 Generated ${config.data.userCount} synthetic users`);
    console.log(`👥 Initialized ${config.data.interviewerCount} interviewers`);
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
