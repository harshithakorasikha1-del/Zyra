// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  searchUsers,
  addFriend,
  acceptFriendRequest,
  getFriends,
  removeFriend,
  blockUser,
} = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

router.get('/:id', authMiddleware, getUserProfile);
router.put('/profile/update', authMiddleware, updateUserProfile);
router.get('/search/users', authMiddleware, searchUsers);
router.post('/friend/add', authMiddleware, addFriend);
router.post('/friend/accept', authMiddleware, acceptFriendRequest);
router.get('/friends/all', authMiddleware, getFriends);
router.post('/friend/remove', authMiddleware, removeFriend);
router.post('/user/block', authMiddleware, blockUser);

module.exports = router;
