const mongoose = require('mongoose');

// ============================================
// EMBEDDED DOCUMENT: Transaction Details
// ============================================
const transactionDetailsSchema = new mongoose.Schema(
  {
    paymentMethod: { type: String, enum: ['card', 'bank', 'wallet'], default: 'wallet' },
    referenceId: { type: String, default: '' },
    status: { type: String, enum: ['success', 'failed', 'pending'], default: 'success' }
  },
  { _id: false }
);

const transactionSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: true
    },
    type: { type: String, enum: ['credit', 'debit'], required: true },
    amount: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, trim: true },
    
    // ============================================
    // EMBEDDED DOCUMENT: Transaction Details
    // ============================================
    details: transactionDetailsSchema,
    
    // Element Operator Example: isVerified
    isVerified: { type: Boolean, default: false },
    tags: [{ type: String, trim: true }]
  },
  { timestamps: true }
);

// ============================================
// INDEXING STRATEGIES
// ============================================

// 1. SINGLE FIELD INDEX - for driver transactions
transactionSchema.index({ driverId: 1 });

// 2. COMPOUND INDEX - for filtering transactions by type and driver
transactionSchema.index({ driverId: 1, type: 1 });

// 3. COMPOUND INDEX - for time-based queries (driverId + createdAt)
transactionSchema.index({ driverId: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
