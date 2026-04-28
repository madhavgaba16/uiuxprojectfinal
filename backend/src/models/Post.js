const mongoose = require('mongoose');

// ============================================
// EMBEDDED DOCUMENT 1: Comment with Metadata
// ============================================
const commentSchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    authorName: { type: String, required: true },
    text: { type: String, required: true, trim: true },
    isEdited: { type: Boolean, default: false },
    likes: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// ============================================
// EMBEDDED DOCUMENT 2: Metadata and Analytics
// ============================================
const analyticsSchema = new mongoose.Schema(
  {
    views: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    engagementScore: { type: Number, default: 0 },
    isSponsored: { type: Boolean, default: false }
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
    category: { type: String, enum: ['ride', 'alert'], required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    pickupPoint: { type: String, default: '', trim: true },
    dropPoint: { type: String, default: '', trim: true },
    customerDetails: { type: String, default: '', trim: true },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    
    // ============================================
    // EMBEDDED DOCUMENT 1: Comments Array
    // ============================================
    comments: { type: [commentSchema], default: [] },
    
    // ============================================
    // EMBEDDED DOCUMENT 2: Analytics
    // ============================================
    analytics: analyticsSchema,
    
    // Array Operator Example: Tags array
    tags: [{ type: String, trim: true }],
    
    // Element Operator Example: isPublished
    isPublished: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// ============================================
// INDEXING STRATEGIES
// ============================================

// 1. SINGLE FIELD INDEX - for category lookups
postSchema.index({ category: 1 });

// 2. TEXT INDEX - for full-text search on title and description
postSchema.index({ title: 'text', description: 'text' });

// 3. COMPOUND INDEX - for multiple criteria queries (authorId + isPublished)
postSchema.index({ authorId: 1, isPublished: 1 });

// 4. COMPOUND INDEX - for sorting by date and filtering by category
postSchema.index({ category: 1, createdAt: -1 });

// 5. MULTIKEY INDEX - for tag-based filtering
postSchema.index({ tags: 1 });

module.exports = mongoose.model('Post', postSchema);
