const { query } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class RoutingHistory {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.user_id = data.user_id;
    this.interviewer_id = data.interviewer_id;
    this.score = data.score;
    this.reason = data.reason;
    this.timestamp = data.timestamp;
    this.requirements = data.requirements;
    this.created_at = data.created_at;
  }

  // Create a new routing history entry
  static async create(routingData) {
    const {
      user_id, interviewer_id, score, reason, requirements
    } = routingData;

    const result = await query(
      `INSERT INTO routing_history (id, user_id, interviewer_id, score, reason, requirements)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [uuidv4(), user_id, interviewer_id, score, reason, JSON.stringify(requirements)]
    );

    return new RoutingHistory(result.rows[0]);
  }

  // Get all routing history with pagination
  static async findAll(limit = 20, offset = 0) {
    const result = await query(
      `SELECT rh.*, u.name as user_name, i.name as interviewer_name
       FROM routing_history rh
       LEFT JOIN users u ON rh.user_id = u.id
       LEFT JOIN interviewers i ON rh.interviewer_id = i.id
       ORDER BY rh.timestamp DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return result.rows.map(row => ({
      ...row,
      requirements: row.requirements ? JSON.parse(row.requirements) : null
    }));
  }

  // Get routing history by user ID
  static async findByUserId(userId, limit = 20) {
    const result = await query(
      `SELECT rh.*, i.name as interviewer_name
       FROM routing_history rh
       LEFT JOIN interviewers i ON rh.interviewer_id = i.id
       WHERE rh.user_id = $1
       ORDER BY rh.timestamp DESC
       LIMIT $2`,
      [userId, limit]
    );

    return result.rows.map(row => ({
      ...row,
      requirements: row.requirements ? JSON.parse(row.requirements) : null
    }));
  }

  // Get routing history by interviewer ID
  static async findByInterviewerId(interviewerId, limit = 20) {
    const result = await query(
      `SELECT rh.*, u.name as user_name
       FROM routing_history rh
       LEFT JOIN users u ON rh.user_id = u.id
       WHERE rh.interviewer_id = $1
       ORDER BY rh.timestamp DESC
       LIMIT $2`,
      [interviewerId, limit]
    );

    return result.rows.map(row => ({
      ...row,
      requirements: row.requirements ? JSON.parse(row.requirements) : null
    }));
  }

  // Get routing history by date range
  static async findByDateRange(startDate, endDate, limit = 100) {
    const result = await query(
      `SELECT rh.*, u.name as user_name, i.name as interviewer_name
       FROM routing_history rh
       LEFT JOIN users u ON rh.user_id = u.id
       LEFT JOIN interviewers i ON rh.interviewer_id = i.id
       WHERE rh.timestamp BETWEEN $1 AND $2
       ORDER BY rh.timestamp DESC
       LIMIT $3`,
      [startDate, endDate, limit]
    );

    return result.rows.map(row => ({
      ...row,
      requirements: row.requirements ? JSON.parse(row.requirements) : null
    }));
  }

  // Get routing statistics
  static async getStats() {
    const result = await query(`
      SELECT 
        COUNT(*) as total_routings,
        AVG(score) as average_score,
        COUNT(CASE WHEN interviewer_id IS NOT NULL THEN 1 END) as successful_routings,
        COUNT(CASE WHEN interviewer_id IS NULL THEN 1 END) as failed_routings
      FROM routing_history
    `);

    return result.rows[0];
  }

  // Get recent routing activity
  static async getRecentActivity(limit = 10) {
    const result = await query(
      `SELECT rh.*, u.name as user_name, i.name as interviewer_name
       FROM routing_history rh
       LEFT JOIN users u ON rh.user_id = u.id
       LEFT JOIN interviewers i ON rh.interviewer_id = i.id
       ORDER BY rh.timestamp DESC
       LIMIT $1`,
      [limit]
    );

    return result.rows.map(row => ({
      ...row,
      requirements: row.requirements ? JSON.parse(row.requirements) : null
    }));
  }

  // Get routing count
  static async count() {
    const result = await query('SELECT COUNT(*) FROM routing_history');
    return parseInt(result.rows[0].count);
  }

  // Delete routing history entry
  async delete() {
    await query('DELETE FROM routing_history WHERE id = $1', [this.id]);
    return true;
  }

  // Convert to JSON (for API responses)
  toJSON() {
    return {
      id: this.id,
      userId: this.user_id,
      interviewerId: this.interviewer_id,
      score: this.score,
      reason: this.reason,
      timestamp: this.timestamp,
      requirements: this.requirements,
      created_at: this.created_at
    };
  }
}

module.exports = RoutingHistory;
