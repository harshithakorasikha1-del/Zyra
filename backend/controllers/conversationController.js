// controllers/conversationController.js
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

// Get User Conversations
exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
      archivedBy: { $ne: req.user._id },
    })
      .populate('participants', 'username profilePicture isOnline lastSeen')
      .populate('lastMessage')
      .sort({ lastMessageTime: -1 });

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get or Create Conversation
exports.getOrCreateConversation = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, userId] },
    })
      .populate('participants', 'username profilePicture isOnline')
      .populate('lastMessage');

    if (!conversation) {
      // Create new conversation
      conversation = new Conversation({
        participants: [req.user._id, userId],
        isGroup: false,
      });
      await conversation.save();
      await conversation.populate('participants', 'username profilePicture isOnline');
    }

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Archive Conversation
exports.archiveConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { $addToSet: { archivedBy: req.user._id } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Conversation archived',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Delete Conversation
exports.deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    // Delete all messages in conversation
    await Message.deleteMany({ conversationId });

    // Delete conversation
    await Conversation.findByIdAndDelete(conversationId);

    res.status(200).json({
      success: true,
      message: 'Conversation deleted',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Mute Conversation
exports.muteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { $addToSet: { mutedBy: req.user._id } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Conversation muted',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
