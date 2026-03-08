// routes/conversationRoutes.js
const express = require('express');
const router = express.Router();
const {
  getConversations,
  getOrCreateConversation,
  archiveConversation,
  deleteConversation,
  muteConversation,
} = require('../controllers/conversationController');
const authMiddleware = require('../middleware/auth');

router.get('/all', authMiddleware, getConversations);
router.get('/:userId', authMiddleware, getOrCreateConversation);
router.put('/:conversationId/archive', authMiddleware, archiveConversation);
router.delete('/:conversationId', authMiddleware, deleteConversation);
router.put('/:conversationId/mute', authMiddleware, muteConversation);

module.exports = router;
