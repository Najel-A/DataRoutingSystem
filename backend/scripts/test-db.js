#!/usr/bin/env node

const { testConnection } = require('../src/config/database');
const DatabaseService = require('../src/services/databaseService');

async function testDatabase() {
  try {
    console.log('$$$ Testing database connection and data access...');
    
    // Test connection
    const connected = await testConnection();
    if (!connected) {
      console.log('$$$ Database connection failed');
      return;
    }
    
    console.log('$$$ Database connection successful');
    
    // Test data access
    console.log('$$$ Testing data access...');
    
    const userCount = await DatabaseService.getUserCount();
    console.log(`$$$ Users in database: ${userCount}`);
    
    const interviewerCount = await DatabaseService.getInterviewerCount();
    console.log(`$$$ Interviewers in database: ${interviewerCount}`);
    
    const availableInterviewers = await DatabaseService.getAvailableInterviewerCount();
    console.log(`$$$ Available interviewers: ${availableInterviewers}`);
    
    const routingStats = await DatabaseService.getRoutingStats();
    console.log(`$$$ Routing history entries: ${routingStats.total_routings}`);
    
    if (userCount > 0) {
      console.log('$$$ Testing user data retrieval...');
      const users = await DatabaseService.getUsers(5);
      console.log(`$$$ Retrieved ${users.length} users`);
      if (users.length > 0) {
        console.log(`$$$ Sample user: ${users[0].name} (${users[0].email})`);
      }
    }
    
    if (interviewerCount > 0) {
      console.log('$$$ Testing interviewer data retrieval...');
      const interviewers = await DatabaseService.getInterviewers();
      console.log(`$$$ Retrieved ${interviewers.length} interviewers`);
      if (interviewers.length > 0) {
        console.log(`$$$ Sample interviewer: ${interviewers[0].name} (${interviewers[0].specialization})`);
      }
    }
    
    console.log('$$$ Database test completed successfully!');
    
  } catch (error) {
    console.error('$$$ Database test failed:', error.message);
  }
}

// Run the test
if (require.main === module) {
  testDatabase();
}

module.exports = { testDatabase };
