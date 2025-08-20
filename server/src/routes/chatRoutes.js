const express = require('express');
const {
  sendMessage,
  getChatHistory,
  clearChatHistory
} = require('../controllers/chatController');
const { auth } = require('../middleware/auth');
const { validateChatMessage } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(auth);

// Chat routes
router.post('/message', validateChatMessage, sendMessage);
router.get('/history', getChatHistory);
router.delete('/history', clearChatHistory);

module.exports = router;
