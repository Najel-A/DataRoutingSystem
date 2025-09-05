const { query, testConnection } = require('../config/database');

// SQL statements for creating tables
const createTables = async () => {
  try {
    console.log('$$$ Creating database tables...');

    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        age INTEGER NOT NULL,
        gender VARCHAR(50) NOT NULL,
        demographic VARCHAR(100) NOT NULL,
        education VARCHAR(100) NOT NULL,
        industry VARCHAR(100) NOT NULL,
        location JSONB NOT NULL,
        metadata JSONB NOT NULL,
        preferences JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create interviewers table
    await query(`
      CREATE TABLE IF NOT EXISTS interviewers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        specialization VARCHAR(100) NOT NULL,
        experience INTEGER NOT NULL,
        availability BOOLEAN DEFAULT true,
        current_load INTEGER DEFAULT 0,
        max_load INTEGER DEFAULT 8,
        rating DECIMAL(3,1) NOT NULL,
        languages JSONB NOT NULL,
        cost_per_hour INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create interviews table (for interview history)
    await query(`
      CREATE TABLE IF NOT EXISTS interviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        date TIMESTAMP NOT NULL,
        duration INTEGER NOT NULL,
        cost INTEGER NOT NULL,
        interviewer_name VARCHAR(255) NOT NULL,
        rating INTEGER NOT NULL,
        notes TEXT,
        outcome VARCHAR(100) NOT NULL,
        transcript JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create routing_history table
    await query(`
      CREATE TABLE IF NOT EXISTS routing_history (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        interviewer_id UUID REFERENCES interviewers(id) ON DELETE SET NULL,
        score DECIMAL(5,3),
        reason TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        requirements JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('$$$ Database tables created successfully');
  } catch (error) {
    console.error('$$$ Error creating tables:', error);
    throw error;
  }
};

// Create indexes for better performance
const createIndexes = async () => {
  try {
    console.log('$$$ Creating database indexes...');

    // Users table indexes
    await query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await query('CREATE INDEX IF NOT EXISTS idx_users_industry ON users(industry)');
    await query('CREATE INDEX IF NOT EXISTS idx_users_demographic ON users(demographic)');

    // Interviewers table indexes
    await query('CREATE INDEX IF NOT EXISTS idx_interviewers_availability ON interviewers(availability)');
    await query('CREATE INDEX IF NOT EXISTS idx_interviewers_specialization ON interviewers(specialization)');
    await query('CREATE INDEX IF NOT EXISTS idx_interviewers_rating ON interviewers(rating)');

    // Interviews table indexes
    await query('CREATE INDEX IF NOT EXISTS idx_interviews_user_id ON interviews(user_id)');
    await query('CREATE INDEX IF NOT EXISTS idx_interviews_date ON interviews(date)');

    // Routing history indexes
    await query('CREATE INDEX IF NOT EXISTS idx_routing_history_user_id ON routing_history(user_id)');
    await query('CREATE INDEX IF NOT EXISTS idx_routing_history_timestamp ON routing_history(timestamp)');
    await query('CREATE INDEX IF NOT EXISTS idx_routing_history_interviewer_id ON routing_history(interviewer_id)');

    console.log('$$$ Database indexes created successfully');
  } catch (error) {
    console.error('$$$ Error creating indexes:', error);
    throw error;
  }
};

// Initialize database
const initializeDatabase = async () => {
  try {
    console.log('$$$ Initializing database...');
    
    // Test connection first
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Database connection failed');
    }

    // Create tables
    await createTables();

    // Create indexes
    await createIndexes();

    console.log('$$$ Database initialization completed successfully');
    return true;
  } catch (error) {
    console.error('$$$ Database initialization failed:', error);
    throw error;
  }
};

// Drop all tables (for development/reset)
const dropTables = async () => {
  try {
    console.log('$$$ Dropping all tables...');
    
    await query('DROP TABLE IF EXISTS routing_history CASCADE');
    await query('DROP TABLE IF EXISTS interviews CASCADE');
    await query('DROP TABLE IF EXISTS interviewers CASCADE');
    await query('DROP TABLE IF EXISTS users CASCADE');
    
    console.log('$$$ All tables dropped successfully');
  } catch (error) {
    console.error('$$$ Error dropping tables:', error);
    throw error;
  }
};

module.exports = {
  initializeDatabase,
  createTables,
  createIndexes,
  dropTables
};
