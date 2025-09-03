const { v4: uuidv4 } = require('uuid');

// In-memory storage for users and routing data
let users = [];
let routingHistory = [];
let activeInterviewers = [];

// Generate synthetic user data
function generateSyntheticUsers(count = 100) {
  const demographics = ['White', 'Hispanic', 'Black', 'Asian', 'Other'];
  const educationLevels = ['High School', 'Bachelor', 'Master', 'PhD'];
  const industries = ['Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing'];
  
  for (let i = 0; i < count; i++) {
    const user = {
      id: uuidv4(),
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      age: Math.floor(Math.random() * 50) + 18,
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      demographic: demographics[Math.floor(Math.random() * demographics.length)],
      education: educationLevels[Math.floor(Math.random() * educationLevels.length)],
      industry: industries[Math.floor(Math.random() * industries.length)],
      location: {
        city: `City ${Math.floor(Math.random() * 20) + 1}`,
        state: `State ${Math.floor(Math.random() * 10) + 1}`,
        country: 'USA'
      },
      interviewHistory: generateInterviewHistory(),
      metadata: {
        averageInterviewTime: Math.floor(Math.random() * 60) + 15, // minutes
        averageInterviewCost: Math.floor(Math.random() * 200) + 50, // dollars
        totalInterviews: Math.floor(Math.random() * 10) + 1,
        lastInterviewDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
      },
      preferences: {
        preferredLanguage: Math.random() > 0.8 ? 'Spanish' : 'English',
        preferredTime: Math.random() > 0.5 ? 'Morning' : 'Afternoon',
        specialNeeds: Math.random() > 0.9 ? 'Accessibility required' : null
      }
    };
    users.push(user);
  }
}

// Generate interview history for each user
function generateInterviewHistory() {
  const count = Math.floor(Math.random() * 5) + 1;
  const history = [];
  
  for (let i = 0; i < count; i++) {
    const interview = {
      id: uuidv4(),
      date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      duration: Math.floor(Math.random() * 60) + 15,
      cost: Math.floor(Math.random() * 200) + 50,
      interviewer: `Interviewer ${Math.floor(Math.random() * 20) + 1}`,
      rating: Math.floor(Math.random() * 5) + 1,
      notes: `Interview ${i + 1} notes for user`,
      outcome: Math.random() > 0.5 ? 'Successful' : 'Needs follow-up'
    };
    history.push(interview);
  }
  
  return history;
}

// Initialize active interviewers
function initializeInterviewers() {
  const interviewerTypes = ['Senior', 'Junior', 'Specialist', 'General'];
  const specializations = ['Technical', 'Behavioral', 'Cultural', 'Leadership'];
  
  for (let i = 0; i < 25; i++) {
    const interviewer = {
      id: uuidv4(),
      name: `Interviewer ${i + 1}`,
      type: interviewerTypes[Math.floor(Math.random() * interviewerTypes.length)],
      specialization: specializations[Math.floor(Math.random() * specializations.length)],
      experience: Math.floor(Math.random() * 15) + 1,
      availability: Math.random() > 0.3, // 70% available
      currentLoad: Math.floor(Math.random() * 5),
      maxLoad: 8,
      rating: (Math.random() * 2) + 3, // 3-5 rating
      languages: Math.random() > 0.8 ? ['English', 'Spanish'] : ['English'],
      costPerHour: Math.floor(Math.random() * 100) + 50
    };
    activeInterviewers.push(interviewer);
  }
}

// Getter functions for data access
function getUsers() {
  return users;
}

function getRoutingHistory() {
  return routingHistory;
}

function getActiveInterviewers() {
  return activeInterviewers;
}

// Add routing decision to history
function addRoutingDecision(routingDecision) {
  routingHistory.push(routingDecision);
}

// Update interviewer load
function updateInterviewerLoad(interviewerId, increment = 1) {
  const interviewer = activeInterviewers.find(i => i.id === interviewerId);
  if (interviewer) {
    interviewer.currentLoad += increment;
    if (interviewer.currentLoad >= interviewer.maxLoad) {
      interviewer.availability = false;
    }
  }
}

module.exports = {
  generateSyntheticUsers,
  initializeInterviewers,
  getUsers,
  getRoutingHistory,
  getActiveInterviewers,
  addRoutingDecision,
  updateInterviewerLoad
};
