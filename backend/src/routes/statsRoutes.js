const express = require('express');
const { getUsers, getRoutingHistory, getActiveInterviewers } = require('../data/generators');

const router = express.Router();

// Get routing history with pagination
router.get('/routing-history', (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const routingHistory = getRoutingHistory();
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  
  res.json({
    history: routingHistory.slice(startIndex, endIndex),
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: routingHistory.length,
      pages: Math.ceil(routingHistory.length / limit)
    }
  });
});

// Get system statistics
router.get('/stats', (req, res) => {
  const users = getUsers();
  const routingHistory = getRoutingHistory();
  const activeInterviewers = getActiveInterviewers();
  
  const totalUsers = users.length;
  const totalInterviews = users.reduce((sum, user) => sum + user.interviewHistory.length, 0);
  const averageInterviewTime = users.reduce((sum, user) => sum + user.metadata.averageInterviewTime, 0) / totalUsers;
  const averageInterviewCost = users.reduce((sum, user) => sum + user.metadata.averageInterviewCost, 0) / totalUsers;
  
  res.json({
    totalUsers,
    totalInterviews,
    averageInterviewTime: Math.round(averageInterviewTime * 100) / 100,
    averageInterviewCost: Math.round(averageInterviewCost * 100) / 100,
    activeInterviewers: activeInterviewers.filter(i => i.availability).length,
    totalInterviewers: activeInterviewers.length,
    recentRoutings: routingHistory.slice(-10)
  });
});

module.exports = router;
