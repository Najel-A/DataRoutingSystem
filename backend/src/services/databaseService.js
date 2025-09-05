const User = require('../models/User');
const Interviewer = require('../models/Interviewer');
const RoutingHistory = require('../models/RoutingHistory');

class DatabaseService {
  // User operations
  static async getUsers(limit = 100, offset = 0) {
    return await User.findAll(limit, offset);
  }

  static async getUserById(id) {
    return await User.findById(id);
  }

  static async getUserByEmail(email) {
    return await User.findByEmail(email);
  }

  static async getUsersByIndustry(industry, limit = 100) {
    return await User.findByIndustry(industry, limit);
  }

  static async getUserCount() {
    return await User.count();
  }

  // Interviewer operations
  static async getInterviewers() {
    return await Interviewer.findAll();
  }

  static async getAvailableInterviewers() {
    return await Interviewer.findAvailable();
  }

  static async getInterviewerById(id) {
    return await Interviewer.findById(id);
  }

  static async getInterviewersBySpecialization(specialization) {
    return await Interviewer.findBySpecialization(specialization);
  }

  static async getInterviewersByLanguage(language) {
    return await Interviewer.findByLanguage(language);
  }

  static async getInterviewerCount() {
    return await Interviewer.count();
  }

  static async getAvailableInterviewerCount() {
    return await Interviewer.countAvailable();
  }

  // Routing operations
  static async getRoutingHistory(limit = 20, offset = 0) {
    return await RoutingHistory.findAll(limit, offset);
  }

  static async getRoutingHistoryByUserId(userId, limit = 20) {
    return await RoutingHistory.findByUserId(userId, limit);
  }

  static async getRoutingHistoryByInterviewerId(interviewerId, limit = 20) {
    return await RoutingHistory.findByInterviewerId(interviewerId, limit);
  }

  static async getRecentRoutingActivity(limit = 10) {
    return await RoutingHistory.getRecentActivity(limit);
  }

  static async getRoutingStats() {
    return await RoutingHistory.getStats();
  }

  static async addRoutingDecision(routingData) {
    return await RoutingHistory.create(routingData);
  }

  // Update interviewer load
  static async updateInterviewerLoad(interviewerId, increment = 1) {
    const interviewer = await Interviewer.findById(interviewerId);
    if (interviewer) {
      return await interviewer.updateLoad(increment);
    }
    return null;
  }

  // Get system statistics
  static async getSystemStats() {
    try {
      const [
        totalUsers,
        totalInterviewers,
        availableInterviewers,
        routingStats
      ] = await Promise.all([
        this.getUserCount(),
        this.getInterviewerCount(),
        this.getAvailableInterviewerCount(),
        this.getRoutingStats()
      ]);

      // Calculate average interview time and cost from user metadata
      const users = await this.getUsers(1000); // Get all users for calculation
      const avgInterviewTime = users.length > 0 
        ? Math.round(users.reduce((sum, user) => sum + user.metadata.averageInterviewTime, 0) / users.length)
        : 0;
      
      const avgInterviewCost = users.length > 0
        ? Math.round(users.reduce((sum, user) => sum + user.metadata.averageInterviewCost, 0) / users.length)
        : 0;

      return {
        totalUsers,
        totalInterviewers,
        activeInterviewers: availableInterviewers,
        averageInterviewTime: avgInterviewTime,
        averageInterviewCost: avgInterviewCost,
        totalRoutings: routingStats.total_routings,
        averageScore: routingStats.average_score ? parseFloat(routingStats.average_score) : 0,
        successfulRoutings: routingStats.successful_routings,
        failedRoutings: routingStats.failed_routings
      };
    } catch (error) {
      console.error('Error getting system stats:', error);
      return {
        totalUsers: 0,
        totalInterviewers: 0,
        activeInterviewers: 0,
        averageInterviewTime: 0,
        averageInterviewCost: 0,
        totalRoutings: 0,
        averageScore: 0,
        successfulRoutings: 0,
        failedRoutings: 0
      };
    }
  }

  // Get user with interview history
  static async getUserWithHistory(userId) {
    const user = await this.getUserById(userId);
    if (!user) return null;

    const interviewHistory = await user.getInterviewHistory();
    const routingHistory = await user.getRoutingHistory();

    return {
      ...user.toJSON(),
      interviewHistory,
      routingHistory
    };
  }

  // Get interviewer with routing history
  static async getInterviewerWithHistory(interviewerId) {
    const interviewer = await this.getInterviewerById(interviewerId);
    if (!interviewer) return null;

    const routingHistory = await interviewer.getRoutingHistory();

    return {
      ...interviewer.toJSON(),
      routingHistory
    };
  }
}

module.exports = DatabaseService;
