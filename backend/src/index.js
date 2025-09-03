// Main module exports for the backend
module.exports = {
  app: require('./app'),
  config: require('./config'),
  generators: require('./data/generators'),
  routingService: require('./services/routingService'),
  routes: {
    userRoutes: require('./routes/userRoutes'),
    routingRoutes: require('./routes/routingRoutes'),
    interviewerRoutes: require('./routes/interviewerRoutes'),
    statsRoutes: require('./routes/statsRoutes')
  },
  middleware: {
    errorHandler: require('./middleware/errorHandler')
  }
};
