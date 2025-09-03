require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3001,
  microserviceUrl: process.env.MICROSERVICE_URL,
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  },
  data: {
    userCount: parseInt(process.env.USER_COUNT) || 100,
    interviewerCount: parseInt(process.env.INTERVIEWER_COUNT) || 25
  }
};
