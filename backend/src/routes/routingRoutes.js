const express = require('express');
const { routeUser } = require('../services/routingService');

const router = express.Router();

// Route a user to an interviewer
router.post('/route', async (req, res) => {
  try {
    const { userId, requirements } = req.body;
    const result = await routeUser(userId, requirements);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
