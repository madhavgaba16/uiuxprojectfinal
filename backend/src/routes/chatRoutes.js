const express = require('express');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Driver = require('../models/Driver');
const { timeAgo } = require('../utils/timeAgo');

const router = express.Router();

// ============================================
// CREATE OPERATION with $all array operator
// ============================================
router.post('/start', async (req, res) => {
  try {
    const { driverId, otherDriverId } = req.body;
    if (!driverId || !otherDriverId) {
      return res.status(400).json({ message: 'driverId and otherDriverId are required' });
    }

    // READ with ARRAY OPERATOR: $all - match if both participants exist
    // and COMPARISON OPERATOR: $size
    let conversation = await Conversation.findOne({
      participants: { $all: [driverId, otherDriverId] },
      'participants.1': { $exists: true }
    });

    if (!conversation) {
      // CREATE OPERATION with EMBEDDED DOCUMENT (Settings)
      conversation = await Conversation.create({
        participants: [driverId, otherDriverId],
        settings: {
          isMuted: false,
          isBlocked: false,
          isArchived: false
        },
        messageCount: 0
      });
    }

    res.status(201).json({ conversationId: conversation._id.toString() });
  } catch (error) {
    res.status(500).json({ message: 'Unable to start chat', error: error.message });
  }
});

// ============================================
// READ with LOGICAL OPERATORS and ELEMENT OPERATOR
// ============================================
router.get('/', async (req, res) => {
  try {
    const { driverId } = req.query;
    if (!driverId) {
      return res.status(400).json({ message: 'driverId is required' });
    }

    // LOGICAL OPERATOR: $and (implicit) with ELEMENT OPERATOR: $exists
    const conversations = await Conversation.find({
      participants: driverId,
      'settings.isArchived': { $ne: true }
    })
      .populate('participants', 'name vehicleNumber')
      .sort({ lastMessageAt: -1 });

    const list = conversations.map((conv) => {
      const other = conv.participants.find((p) => p._id.toString() !== driverId);
      return {
        id: conv._id.toString(),
        otherDriverId: other?._id?.toString() || '',
        name: other?.name || 'Driver',
        vehicleNumber: other?.vehicleNumber || 'PB11-XX-XXXX',
        lastMessage: conv.lastMessage || 'Start conversation',
        time: timeAgo(conv.lastMessageAt),
        messageCount: conv.messageCount || 0
      };
    });

    res.json({ conversations: list });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch chats', error: error.message });
  }
});

// ============================================
// READ Messages with COMPARISON OPERATORS
// ============================================
router.get('/:conversationId/messages', async (req, res) => {
  try {
    // COMPARISON OPERATOR: $eq (implicit with direct field match)
    // and ELEMENT OPERATOR: $exists for metadata
    const messages = await Message.find({
      conversationId: req.params.conversationId,
      'metadata.isRead': { $exists: true }
    })
      .sort({ createdAt: 1 })
      .populate('senderId', 'name');

    res.json({
      messages: messages.map((m) => ({
        id: m._id.toString(),
        senderId: m.senderId?._id?.toString() || '',
        senderName: m.senderId?.name || 'Driver',
        content: m.content,
        isRead: m.metadata?.isRead || false,
        time: timeAgo(m.createdAt)
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch messages', error: error.message });
  }
});

// ============================================
// CREATE MESSAGE with EMBEDDED DOCUMENT (metadata)
// ============================================
router.post('/:conversationId/messages', async (req, res) => {
  try {
    const { senderId, content } = req.body;
    if (!senderId || !content || !content.trim()) {
      return res.status(400).json({ message: 'senderId and content are required' });
    }

    const sender = await Driver.findById(senderId);
    if (!sender) return res.status(404).json({ message: 'Sender not found' });

    // CREATE MESSAGE with EMBEDDED DOCUMENT
    const message = await Message.create({
      conversationId: req.params.conversationId,
      senderId,
      content: content.trim(),
      metadata: {
        isRead: false,
        readAt: null,
        isPinned: false,
        reactions: []
      },
      isDeleted: false,
      editedAt: null
    });

    // UPDATE OPERATION with ARRAY OPERATOR ($inc) to increment message count
    await Conversation.findByIdAndUpdate(req.params.conversationId, {
      lastMessage: content.trim(),
      lastMessageAt: new Date(),
      $inc: { messageCount: 1 }
    });

    res.status(201).json({
      message: {
        id: message._id.toString(),
        senderId: senderId,
        senderName: sender.name,
        content: message.content,
        time: 'Just now'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to send message', error: error.message });
  }
});

// ============================================
// UPDATE MESSAGE as READ (Mark as read)
// ============================================
router.post('/:conversationId/mark-read', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { messageIds } = req.body;

    if (!Array.isArray(messageIds)) {
      return res.status(400).json({ message: 'messageIds array is required' });
    }

    // UPDATE OPERATION with EMBEDDED DOCUMENT field update
    const result = await Message.updateMany(
      { _id: { $in: messageIds }, conversationId },
      {
        $set: {
          'metadata.isRead': true,
          'metadata.readAt': new Date()
        }
      }
    );

    res.json({ modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ message: 'Unable to mark messages as read', error: error.message });
  }
});

// ============================================
// UPDATE MESSAGE with ARRAY OPERATOR ($push for reactions)
// ============================================
router.post('/:conversationId/messages/:messageId/react', async (req, res) => {
  try {
    const { conversationId, messageId } = req.params;
    const { emoji } = req.body;

    if (!emoji) {
      return res.status(400).json({ message: 'Emoji is required' });
    }

    // ARRAY OPERATOR: $push - add reaction to embedded document array
    const message = await Message.findByIdAndUpdate(
      messageId,
      { $push: { 'metadata.reactions': emoji } },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message });
  } catch (error) {
    res.status(500).json({ message: 'Unable to add reaction', error: error.message });
  }
});

// ============================================
// DELETE MESSAGE (soft delete with ELEMENT OPERATOR)
// ============================================
router.delete('/:conversationId/messages/:messageId', async (req, res) => {
  try {
    const { conversationId, messageId } = req.params;

    // ELEMENT OPERATOR: Update isDeleted flag
    const message = await Message.findByIdAndUpdate(
      messageId,
      { isDeleted: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete message', error: error.message });
  }
});

// ============================================
// AGGREGATION PIPELINE 1: Conversation Statistics
// ============================================
router.get('/:conversationId/stats', async (req, res) => {
  try {
    const conversationId = req.params.conversationId;

    // AGGREGATION PIPELINE with multiple stages
    const stats = await Message.aggregate([
      // COMPARISON OPERATOR: $eq to filter by conversation
      {
        $match: {
          conversationId: require('mongoose').Types.ObjectId(conversationId),
          isDeleted: { $ne: true }
        }
      },
      
      // GROUP messages and calculate statistics
      {
        $group: {
          _id: '$senderId',
          messageCount: { $sum: 1 },
          avgMessageLength: { $avg: { $strLenCP: '$content' } },
          firstMessage: { $min: '$createdAt' },
          lastMessage: { $max: '$createdAt' }
        }
      },
      
      // SORT by message count
      {
        $sort: { messageCount: -1 }
      }
    ]);

    res.json({ stats });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch conversation stats', error: error.message });
  }
});

// ============================================
// AGGREGATION PIPELINE 2: Message Analytics with Read Status
// ============================================
router.get('/:conversationId/analytics', async (req, res) => {
  try {
    const conversationId = req.params.conversationId;

    // AGGREGATION PIPELINE with $facet
    const analytics = await Message.aggregate([
      // ELEMENT OPERATOR: $exists for metadata fields
      {
        $match: {
          conversationId: require('mongoose').Types.ObjectId(conversationId),
          'metadata.isRead': { $exists: true }
        }
      },
      
      // Use $facet for multiple aggregations
      {
        $facet: {
          // Read vs Unread messages
          readStatus: [
            {
              $group: {
                _id: '$metadata.isRead',
                count: { $sum: 1 }
              }
            }
          ],
          
          // Pinned messages
          pinnedMessages: [
            {
              $match: { 'metadata.isPinned': true }
            },
            { $limit: 10 },
            { $project: { content: 1, senderId: 1, createdAt: 1 } }
          ],
          
          // Message reactions
          reactedMessages: [
            {
              $match: { 'metadata.reactions.0': { $exists: true } }
            },
            { $project: { content: 1, 'metadata.reactions': 1 } }
          ]
        }
      }
    ]);

    res.json({ analytics: analytics[0] });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch conversation analytics', error: error.message });
  }
});

// ============================================
// LOGICAL OPERATORS: $or for searching conversations
// ============================================
router.get('/search/:term', async (req, res) => {
  try {
    const { term } = req.params;
    const { driverId } = req.query;

    if (!driverId) {
      return res.status(400).json({ message: 'driverId is required' });
    }

    // LOGICAL OPERATOR: $or to search in multiple fields
    // COMPARISON OPERATOR: $regex for text matching
    const messages = await Message.find({
      conversationId: { $in: await Conversation.find({ participants: driverId }).select('_id') },
      $or: [
        { content: { $regex: term, $options: 'i' } }
      ],
      isDeleted: false
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('senderId', 'name');

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: 'Unable to search messages', error: error.message });
  }
});

// ============================================
// COMPARISON OPERATORS: $gt, $lt for time-based queries
// ============================================
router.get('/:conversationId/recent-messages', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const hoursAgo = parseInt(req.query.hours) || 24;

    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - hoursAgo);

    // COMPARISON OPERATORS: $gt (greater than)
    const messages = await Message.find({
      conversationId,
      createdAt: { $gt: cutoffTime },
      isDeleted: false
    })
      .sort({ createdAt: -1 })
      .populate('senderId', 'name');

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch recent messages', error: error.message });
  }
});

// ============================================
// ARRAY OPERATOR: $pull to remove reactions
// ============================================
router.post('/:conversationId/messages/:messageId/remove-reaction', async (req, res) => {
  try {
    const { conversationId, messageId } = req.params;
    const { emoji } = req.body;

    if (!emoji) {
      return res.status(400).json({ message: 'Emoji is required' });
    }

    // ARRAY OPERATOR: $pull - remove specific emoji from reactions array
    const message = await Message.findByIdAndUpdate(
      messageId,
      { $pull: { 'metadata.reactions': emoji } },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message });
  } catch (error) {
    res.status(500).json({ message: 'Unable to remove reaction', error: error.message });
  }
});

// ============================================
// LOGICAL OPERATOR: $nor for inactive conversations
// ============================================
router.get('/inactive/:driverId', async (req, res) => {
  try {
    const { driverId } = req.params;

    // LOGICAL OPERATOR: $nor - conversations that have neither recent messages nor are archived
    const inactiveConversations = await Conversation.find({
      participants: driverId,
      $nor: [
        { lastMessageAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
        { 'settings.isArchived': true }
      ]
    }).populate('participants', 'name vehicleNumber');

    res.json({ conversations: inactiveConversations });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch inactive conversations', error: error.message });
  }
});

module.exports = router;
