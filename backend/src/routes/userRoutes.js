const express = require('express');
const DatabaseService = require('../services/databaseService');
const { getUsers } = require('../data/generators'); // Fallback

const router = express.Router();

// Get all users with pagination and search
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const offset = (page - 1) * limit;
    
    // Try to get users from database first
    let users = await DatabaseService.getUsers(parseInt(limit), offset);
    
    // If no users in database, fall back to in-memory
    if (!users || users.length === 0) {
      console.log('$$$ No users in database, using in-memory fallback');
      users = getUsers();
    }
    
    // Convert database users to JSON format
    users = users.map(user => user.toJSON ? user.toJSON() : user);
    
    // Apply search filter if provided
    if (search) {
      users = users.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.industry.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Get total count for pagination
    const totalCount = await DatabaseService.getUserCount();
    const total = totalCount > 0 ? totalCount : users.length;
    
    res.json({
      users: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    // Fallback to in-memory data
    const users = getUsers();
    res.json({
      users: users,
      pagination: {
        page: 1,
        limit: users.length,
        total: users.length,
        pages: 1
      }
    });
  }
});

// Get specific user by ID
router.get('/users/:id', async (req, res) => {
  try {
    // Try to get user from database first
    let user = await DatabaseService.getUserById(req.params.id);
    
    if (!user) {
      // Fallback to in-memory data
      const users = getUsers();
      user = users.find(u => u.id === req.params.id);
    }
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Convert to JSON format if needed
    const userData = user.toJSON ? user.toJSON() : user;
    res.json(userData);
  } catch (error) {
    console.error('Error fetching user:', error);
    // Fallback to in-memory data
    const users = getUsers();
    const user = users.find(u => u.id === req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  }
});

module.exports = router;
