const { query } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class User {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.name = data.name;
    this.email = data.email;
    this.age = data.age;
    this.gender = data.gender;
    this.demographic = data.demographic;
    this.education = data.education;
    this.industry = data.industry;
    this.location = data.location;
    this.metadata = data.metadata;
    this.preferences = data.preferences;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Create a new user
  static async create(userData) {
    const {
      name, email, age, gender, demographic, education, industry,
      location, metadata, preferences
    } = userData;

    const result = await query(
      `INSERT INTO users (id, name, email, age, gender, demographic, education, industry, location, metadata, preferences)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [uuidv4(), name, email, age, gender, demographic, education, industry, 
       JSON.stringify(location), JSON.stringify(metadata), JSON.stringify(preferences)]
    );

    return new User(result.rows[0]);
  }

  // Get all users with pagination
  static async findAll(limit = 100, offset = 0) {
    const result = await query(
      'SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    return result.rows.map(row => new User(row));
  }

  // Get user by ID
  static async findById(id) {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows.length > 0 ? new User(result.rows[0]) : null;
  }

  // Get user by email
  static async findByEmail(email) {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows.length > 0 ? new User(result.rows[0]) : null;
  }

  // Get users by industry
  static async findByIndustry(industry, limit = 100) {
    const result = await query(
      'SELECT * FROM users WHERE industry = $1 ORDER BY created_at DESC LIMIT $2',
      [industry, limit]
    );

    return result.rows.map(row => new User(row));
  }

  // Get user count
  static async count() {
    const result = await query('SELECT COUNT(*) FROM users');
    return parseInt(result.rows[0].count);
  }

  // Update user
  async update(updateData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined && key !== 'id') {
        fields.push(`${key} = $${paramCount}`);
        values.push(typeof updateData[key] === 'object' 
          ? JSON.stringify(updateData[key]) 
          : updateData[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) return this;

    values.push(this.id);
    const result = await query(
      `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return new User(result.rows[0]);
  }

  // Delete user
  async delete() {
    await query('DELETE FROM users WHERE id = $1', [this.id]);
    return true;
  }

  // Get user's interview history
  async getInterviewHistory() {
    const result = await query(
      'SELECT * FROM interviews WHERE user_id = $1 ORDER BY date DESC',
      [this.id]
    );

    return result.rows.map(row => ({
      ...row,
      transcript: row.transcript ? JSON.parse(row.transcript) : null
    }));
  }

  // Get user's routing history
  async getRoutingHistory() {
    const result = await query(
      `SELECT rh.*, i.name as interviewer_name 
       FROM routing_history rh 
       LEFT JOIN interviewers i ON rh.interviewer_id = i.id 
       WHERE rh.user_id = $1 
       ORDER BY rh.timestamp DESC`,
      [this.id]
    );

    return result.rows.map(row => ({
      ...row,
      requirements: row.requirements ? JSON.parse(row.requirements) : null
    }));
  }

  // Convert to JSON (for API responses)
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      age: this.age,
      gender: this.gender,
      demographic: this.demographic,
      education: this.education,
      industry: this.industry,
      location: this.location,
      metadata: this.metadata,
      preferences: this.preferences,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = User;
