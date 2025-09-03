const express = require('express');
const { getUsers } = require('../data/generators');

const router = express.Router();

// Get all users with pagination and search
router.get('/users', (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  
  let filteredUsers = getUsers();
  
  if (search) {
    filteredUsers = filteredUsers.filter(user => 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.industry.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  
  res.json({
    users: paginatedUsers,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredUsers.length,
      pages: Math.ceil(filteredUsers.length / limit)
    }
  });
});

// Get specific user by ID
router.get('/users/:id', (req, res) => {
  const users = getUsers();
  const user = users.find(u => u.id === req.params.id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});

module.exports = router;
