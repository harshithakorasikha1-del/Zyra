// controllers/messageController.js
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

// Send Message
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, content, media } = req.body;

    if (!conversationId) {
      return res.status(400).json({ success: false, message: 'Conversation ID required' });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    // Determine receiver
    const receiver = conversation.participants.find((id) => id.toString() !== req.user._id.toString());

    const message = new Message({
      conversationId,
      sender: req.user._id,
      receiver,
      content,
      media: media || [],
      status: 'sent',
    });

    await message.save();

    // Update conversation last message
    conversation.lastMessage = message._id;
    conversation.lastMessageTime = new Date();
    await conversation.save();

    // Populate sender info
    await message.populate('sender', 'username profilePicture');

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get Messages
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 50, skip = 0 } = req.query;

    const messages = await Message.find({ conversationId, isDeleted: false })
      .populate('sender', 'username profilePicture')
      .populate('receiver', 'username profilePicture')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    // Update read status for received messages
    await Message.updateMany(
      {
        conversationId,
        receiver: req.user._id,
        isRead: false,
      },
      {
        $set: { isRead: true, readAt: new Date(), status: 'read' },
      }
    );

    res.status(200).json({
      success: true,
      messages: messages.reverse(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Edit Message
exports.editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    message.content = content;
    message.isEdited = true;
    message.editedAt = new Date();
    await message.save();

    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Delete Message
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    message.content = '';
    await message.save();

    res.status(200).json({
      success: true,
      message: 'Message deleted',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Add Reaction
exports.addReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    // Remove existing reaction from this user
    message.reactions = message.reactions.filter((r) => r.userId.toString() !== req.user._id.toString());

    // Add new reaction
    message.reactions.push({
      userId: req.user._id,
      emoji,
    });

    await message.save();

    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Search Messages
exports.searchMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ success: false, message: 'Search query required' });
    }

    const messages = await Message.find({
      conversationId,
      content: { $regex: query, $options: 'i' },
      isDeleted: false,
    })
      .populate('sender', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
