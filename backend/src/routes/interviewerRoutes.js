const express = require('express');
const DatabaseService = require('../services/databaseService');
const { getActiveInterviewers } = require('../data/generators'); // Fallback

const router = express.Router();

// Get all interviewers
router.get('/interviewers', async (req, res) => {
  try {
    // Try to get interviewers from database first
    let interviewers = await DatabaseService.getInterviewers();
    
    // If no interviewers in database, fall back to in-memory
    if (!interviewers || interviewers.length === 0) {
      console.log('$$$ No interviewers in database, using in-memory fallback');
      interviewers = getActiveInterviewers();
    }
    
    // Convert database interviewers to JSON format
    interviewers = interviewers.map(interviewer => interviewer.toJSON ? interviewer.toJSON() : interviewer);
    
    res.json(interviewers);
  } catch (error) {
    console.error('Error fetching interviewers:', error);
    // Fallback to in-memory data
    const interviewers = getActiveInterviewers();
    res.json(interviewers);
  }
});

module.exports = router;
