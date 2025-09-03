require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3001;
const MICROSERVICE_URL = process.env.MICROSERVICE_URL || 'http://0.0.0.0:8000';

// Start the server
app.listen(PORT, () => {
  console.log(`$$$ Backend server running on port ${PORT}`);
  console.log(`$$$ Microservice URL: ${MICROSERVICE_URL}`);
});
