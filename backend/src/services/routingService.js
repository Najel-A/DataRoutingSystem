const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const DatabaseService = require('./databaseService');
const { 
  getUsers, 
  getActiveInterviewers, 
  addRoutingDecision, 
  updateInterviewerLoad 
} = require('../data/generators'); // Fallback

const MICROSERVICE_URL = process.env.MICROSERVICE_URL || 'http://0.0.0.0:8000';

// Smart routing algorithm
async function routeUser(userId, requirements = {}) {
  try {
    // Try to get data from database first
    const user = await DatabaseService.getUserById(userId);
    const activeInterviewers = await DatabaseService.getAvailableInterviewers();
    
    if (!user) {
      // Fallback to in-memory data
      const users = getUsers();
      const fallbackUser = users.find(u => u.id === userId);
      if (!fallbackUser) {
        throw new Error('User not found');
      }
      
      // Use fallback data
      const fallbackInterviewers = getActiveInterviewers();
      return await routeUserWithData(fallbackUser, fallbackInterviewers, requirements, true);
    }
    
    // Convert database user to plain object
    const userData = user.toJSON ? user.toJSON() : user;
    const interviewerData = activeInterviewers.map(i => i.toJSON ? i.toJSON() : i);
    
    return await routeUserWithData(userData, interviewerData, requirements, false);
  } catch (error) {
    console.error('Error in routeUser:', error);
    throw error;
  }
}

// Helper function to handle routing with data
async function routeUserWithData(user, activeInterviewers, requirements, isFallback = false) {

  // Get routing recommendation from Python microservice
  try {
    const response = await axios.post(`${MICROSERVICE_URL}/route`, {
      user: user,
      requirements: requirements,
      availableInterviewers: activeInterviewers.filter(i => i.availability && i.currentLoad < i.maxLoad)
    });

    const recommendation = response.data;
    
    // Update interviewer load
    if (recommendation.interviewerId) {
      if (isFallback) {
        updateInterviewerLoad(recommendation.interviewerId, 1);
      } else {
        await DatabaseService.updateInterviewerLoad(recommendation.interviewerId, 1);
      }
    }

    // Log routing decision
    const routingDecision = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      userId: user.id,
      interviewerId: recommendation.interviewerId,
      reason: recommendation.reason,
      score: recommendation.score,
      requirements: requirements
    };
    
    if (isFallback) {
      addRoutingDecision(routingDecision);
    } else {
      await DatabaseService.addRoutingDecision(routingDecision);
    }
    
    return {
      success: true,
      routing: routingDecision,
      user: user,
      interviewer: activeInterviewers.find(i => i.id === recommendation.interviewerId)
    };
  } catch (error) {
    console.error('Error calling microservice:', error.message);
    
    // Fallback routing logic
    const availableInterviewers = activeInterviewers.filter(i => i.availability && i.currentLoad < i.maxLoad);
    if (availableInterviewers.length === 0) {
      throw new Error('No available interviewers');
    }
    
    // Simple fallback: find best match based on user preferences
    const fallbackInterviewer = availableInterviewers.reduce((best, current) => {
      let bestScore = 0;
      let currentScore = 0;
      
      // Language match
      if (best.languages.includes(user.preferences.preferredLanguage)) bestScore += 2;
      if (current.languages.includes(user.preferences.preferredLanguage)) currentScore += 2;
      
      // Experience match
      if (best.experience >= 5) bestScore += 1;
      if (current.experience >= 5) currentScore += 1;
      
      // Load balance
      bestScore += (8 - best.currentLoad);
      currentScore += (8 - current.currentLoad);
      
      return currentScore > bestScore ? current : best;
    });
    
    updateInterviewerLoad(fallbackInterviewer.id, 1);
    
    const routingDecision = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      userId: userId,
      interviewerId: fallbackInterviewer.id,
      reason: 'Fallback routing - best available match',
      score: 0.7,
      requirements: requirements
    };
    
    addRoutingDecision(routingDecision);
    
    return {
      success: true,
      routing: routingDecision,
      user: user,
      interviewer: fallbackInterviewer
    };
  }
}

module.exports = {
  routeUser
};
