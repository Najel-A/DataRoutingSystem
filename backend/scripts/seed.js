#!/usr/bin/env node

const { initializeDatabase } = require('../src/database/init');
const { initializeSyntheticData } = require('../src/data/databaseGenerators');
const { testConnection } = require('../src/config/database');

async function seedDatabase() {
  try {
    console.log('$$$ Starting database seeding process...');
    
    // Test database connection
    console.log('$$$ Testing database connection...');
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Database connection failed. Please check your database configuration.');
    }
    
    // Initialize database schema
    console.log('$$$ Initializing database schema...');
    await initializeDatabase();
    
    // Get user count from command line argument or use default
    const userCount = process.argv[2] ? parseInt(process.argv[2]) : 100;
    
    if (isNaN(userCount) || userCount < 1) {
      throw new Error('Invalid user count. Please provide a positive number.');
    }
    
    console.log(`$$$ Generating synthetic data for ${userCount} users...`);
    
    // Initialize synthetic data
    const { users, interviewers } = await initializeSyntheticData(userCount);
    
    console.log('$$$ Database seeding completed successfully!');
    console.log(`$$$ Summary:`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Interviewers: ${interviewers.length}`);
    console.log(`   - Each user has 1-5 interview history records`);
    console.log(`   - All data is stored in PostgreSQL`);
    
    process.exit(0);
  } catch (error) {
    console.error('$$$ Database seeding failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the seeding process
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
