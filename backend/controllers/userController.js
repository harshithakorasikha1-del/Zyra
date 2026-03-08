// controllers/userController.js
const User = require('../models/User');

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('friends', 'username profilePicture isOnline');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        profilePicture: user.profilePicture,
        bio: user.bio,
        isOnline: user.isOnline,
        lastSeen: user.lastSeen,
        friends: user.friends,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { username, bio, profilePicture } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username, bio, profilePicture },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated',
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Search Users
exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ success: false, message: 'Please provide search query' });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
      _id: { $ne: req.user._id },
    }).select('_id username profilePicture isOnline');

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Add Friend
exports.addFriend = async (req, res) => {
  try {
    const { friendId } = req.body;

    const user = await User.findById(req.user._id);
    const friend = await User.findById(friendId);

    if (!friend) {
      return res.status(404).json({ success: false, message: 'Friend not found' });
    }

    // Check if already friends
    if (user.friends.includes(friendId)) {
      return res.status(400).json({ success: false, message: 'Already friends' });
    }

    // Add to friend requests if not already there
    if (!friend.friendRequests.includes(req.user._id)) {
      friend.friendRequests.push(req.user._id);
      await friend.save();
    }

    res.status(200).json({
      success: true,
      message: 'Friend request sent',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Accept Friend Request
exports.acceptFriendRequest = async (req, res) => {
  try {
    const { friendId } = req.body;

    const user = await User.findById(req.user._id);
    const friend = await User.findById(friendId);

    if (!friend) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Remove from friend requests
    user.friendRequests = user.friendRequests.filter((id) => id.toString() !== friendId);

    // Add to friends
    if (!user.friends.includes(friendId)) {
      user.friends.push(friendId);
    }
    if (!friend.friends.includes(req.user._id)) {
      friend.friends.push(req.user._id);
    }

    await user.save();
    await friend.save();

    res.status(200).json({
      success: true,
      message: 'Friend request accepted',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get Friends
exports.getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('friends', 'username profilePicture isOnline lastSeen');

    res.status(200).json({
      success: true,
      friends: user.friends,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Remove Friend
exports.removeFriend = async (req, res) => {
  try {
    const { friendId } = req.body;

    const user = await User.findById(req.user._id);
    const friend = await User.findById(friendId);

    user.friends = user.friends.filter((id) => id.toString() !== friendId);
    friend.friends = friend.friends.filter((id) => id.toString() !== req.user._id);

    await user.save();
    await friend.save();

    res.status(200).json({
      success: true,
      message: 'Friend removed',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Block User
exports.blockUser = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findByIdAndUpdate(req.user._id, { $addToSet: { blockedUsers: userId } }, { new: true });

    res.status(200).json({
      success: true,
      message: 'User blocked',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
