const express = require('express');
const { getActiveInterviewers } = require('../data/generators');

const router = express.Router();

// Get all interviewers
router.get('/interviewers', (req, res) => {
  const interviewers = getActiveInterviewers();
  res.json(interviewers);
});

module.exports = router;
