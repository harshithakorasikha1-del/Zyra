// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
  addReaction,
  searchMessages,
} = require('../controllers/messageController');
const authMiddleware = require('../middleware/auth');

router.post('/send', authMiddleware, sendMessage);
router.get('/:conversationId', authMiddleware, getMessages);
router.put('/:messageId', authMiddleware, editMessage);
router.delete('/:messageId', authMiddleware, deleteMessage);
router.post('/:messageId/react', authMiddleware, addReaction);
router.get('/:conversationId/search', authMiddleware, searchMessages);

module.exports = router;
