const mongoose = require('mongoose');

// ============================================
// EMBEDDED DOCUMENT: Conversation Settings
// ============================================
const settingsSchema = new mongoose.Schema(
  {
    isMuted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false }
  },
  { _id: false }
);

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: true
      }
    ],
    lastMessage: { type: String, default: '' },
    lastMessageAt: { type: Date, default: Date.now },
    
    // ============================================
    // EMBEDDED DOCUMENT: Conversation Settings
    // ============================================
    settings: settingsSchema,
    
    // Array Operator Example: messageCount tracking
    messageCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// ============================================
// INDEXING STRATEGIES
// ============================================

// 1. MULTIKEY INDEX - for searching conversations by participants
conversationSchema.index({ participants: 1 });

// 2. COMPOUND INDEX - for sorting conversations by last message time
conversationSchema.index({ participants: 1, lastMessageAt: -1 });

module.exports = mongoose.model('Conversation', conversationSchema);
