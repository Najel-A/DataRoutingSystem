const { query } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Interviewer {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.name = data.name;
    this.type = data.type;
    this.specialization = data.specialization;
    this.experience = data.experience;
    this.availability = data.availability;
    this.current_load = data.current_load;
    this.max_load = data.max_load;
    this.rating = data.rating;
    this.languages = data.languages;
    this.cost_per_hour = data.cost_per_hour;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Create a new interviewer
  static async create(interviewerData) {
    const {
      name, type, specialization, experience, availability, current_load,
      max_load, rating, languages, cost_per_hour
    } = interviewerData;

    const result = await query(
      `INSERT INTO interviewers (id, name, type, specialization, experience, availability, current_load, max_load, rating, languages, cost_per_hour)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [uuidv4(), name, type, specialization, experience, availability, current_load,
       max_load, rating, JSON.stringify(languages), cost_per_hour]
    );

    return new Interviewer(result.rows[0]);
  }

  // Get all interviewers
  static async findAll() {
    const result = await query('SELECT * FROM interviewers ORDER BY rating DESC, name ASC');
    return result.rows.map(row => new Interviewer(row));
  }

  // Get available interviewers
  static async findAvailable() {
    const result = await query(
      'SELECT * FROM interviewers WHERE availability = true AND current_load < max_load ORDER BY rating DESC'
    );
    return result.rows.map(row => new Interviewer(row));
  }

  // Get interviewer by ID
  static async findById(id) {
    const result = await query('SELECT * FROM interviewers WHERE id = $1', [id]);
    return result.rows.length > 0 ? new Interviewer(result.rows[0]) : null;
  }

  // Get interviewers by specialization
  static async findBySpecialization(specialization) {
    const result = await query(
      'SELECT * FROM interviewers WHERE specialization = $1 AND availability = true ORDER BY rating DESC',
      [specialization]
    );
    return result.rows.map(row => new Interviewer(row));
  }

  // Get interviewers by language
  static async findByLanguage(language) {
    const result = await query(
      `SELECT * FROM interviewers 
       WHERE availability = true 
       AND languages::text LIKE $1 
       ORDER BY rating DESC`,
      [`%${language}%`]
    );
    return result.rows.map(row => new Interviewer(row));
  }

  // Get interviewer count
  static async count() {
    const result = await query('SELECT COUNT(*) FROM interviewers');
    return parseInt(result.rows[0].count);
  }

  // Get available interviewer count
  static async countAvailable() {
    const result = await query('SELECT COUNT(*) FROM interviewers WHERE availability = true');
    return parseInt(result.rows[0].count);
  }

  // Update interviewer
  async update(updateData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined && key !== 'id') {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        fields.push(`${dbKey} = $${paramCount}`);
        values.push(typeof updateData[key] === 'object' 
          ? JSON.stringify(updateData[key]) 
          : updateData[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) return this;

    values.push(this.id);
    const result = await query(
      `UPDATE interviewers SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return new Interviewer(result.rows[0]);
  }

  // Update interviewer load
  async updateLoad(increment = 1) {
    const newLoad = this.current_load + increment;
    const availability = newLoad < this.max_load;

    const result = await query(
      'UPDATE interviewers SET current_load = $1, availability = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [newLoad, availability, this.id]
    );

    return new Interviewer(result.rows[0]);
  }

  // Delete interviewer
  async delete() {
    await query('DELETE FROM interviewers WHERE id = $1', [this.id]);
    return true;
  }

  // Get interviewer's routing history
  async getRoutingHistory() {
    const result = await query(
      `SELECT rh.*, u.name as user_name 
       FROM routing_history rh 
       LEFT JOIN users u ON rh.user_id = u.id 
       WHERE rh.interviewer_id = $1 
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
      type: this.type,
      specialization: this.specialization,
      experience: this.experience,
      availability: this.availability,
      currentLoad: this.current_load,
      maxLoad: this.max_load,
      rating: this.rating,
      languages: this.languages,
      costPerHour: this.cost_per_hour,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = Interviewer;
