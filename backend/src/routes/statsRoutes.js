const express = require('express');
const DatabaseService = require('../services/databaseService');
const { getUsers, getRoutingHistory, getActiveInterviewers } = require('../data/generators'); // Fallback

const router = express.Router();

// Get routing history with pagination
router.get('/routing-history', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    
    // Try to get routing history from database first
    let routingHistory = await DatabaseService.getRoutingHistory(parseInt(limit), offset);
    
    // If no routing history in database, fall back to in-memory
    if (!routingHistory || routingHistory.length === 0) {
      console.log('$$$ No routing history in database, using in-memory fallback');
      routingHistory = getRoutingHistory();
    }
    
    // Get total count for pagination
    const totalCount = await DatabaseService.getRoutingHistory().then(history => history.length).catch(() => 0);
    const total = totalCount > 0 ? totalCount : routingHistory.length;
    
    res.json({
      history: routingHistory,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching routing history:', error);
    // Fallback to in-memory data
    const routingHistory = getRoutingHistory();
    res.json({
      history: routingHistory,
      pagination: {
        page: 1,
        limit: routingHistory.length,
        total: routingHistory.length,
        pages: 1
      }
    });
  }
});

// Get system statistics
router.get('/stats', async (req, res) => {
  try {
    // Try to get stats from database first
    const stats = await DatabaseService.getSystemStats();
    
    if (stats.totalUsers > 0) {
      // Get recent routing activity
      const recentRoutings = await DatabaseService.getRecentRoutingActivity(10);
      
      res.json({
        totalUsers: stats.totalUsers,
        totalInterviews: stats.totalUsers * 3, // Approximate based on user count
        averageInterviewTime: stats.averageInterviewTime,
        averageInterviewCost: stats.averageInterviewCost,
        activeInterviewers: stats.activeInterviewers,
        totalInterviewers: stats.totalInterviewers,
        recentRoutings: recentRoutings
      });
    } else {
      // Fallback to in-memory data
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
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
    // Fallback to in-memory data
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
  }
});

module.exports = router;
