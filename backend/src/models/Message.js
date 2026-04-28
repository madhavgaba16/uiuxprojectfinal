const mongoose = require('mongoose');

// ============================================
// EMBEDDED DOCUMENT: Message Metadata
// ============================================
const messageMetadataSchema = new mongoose.Schema(
  {
    isRead: { type: Boolean, default: false },
    readAt: { type: Date, default: null },
    isPinned: { type: Boolean, default: false },
    reactions: [{ type: String }] // emoji reactions
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: true
    },
    content: { type: String, required: true, trim: true },
    
    // ============================================
    // EMBEDDED DOCUMENT: Message Metadata
    // ============================================
    metadata: messageMetadataSchema,
    
    // Element Operator Example: isDeleted
    isDeleted: { type: Boolean, default: false },
    editedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

// ============================================
// INDEXING STRATEGIES
// ============================================

// 1. SINGLE FIELD INDEX - for conversation lookups
messageSchema.index({ conversationId: 1 });

// 2. COMPOUND INDEX - for retrieving messages by conversation and creation time
messageSchema.index({ conversationId: 1, createdAt: 1 });

// 3. COMPOUND INDEX - for sender and read status
messageSchema.index({ senderId: 1, 'metadata.isRead': 1 });

module.exports = mongoose.model('Message', messageSchema);
