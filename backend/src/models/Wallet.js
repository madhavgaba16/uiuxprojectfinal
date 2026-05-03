const mongoose = require('mongoose');

// ============================================
// EMBEDDED DOCUMENT: Wallet metadata and limits
// ============================================
const walletMetadataSchema = new mongoose.Schema(
  {
    currency: { type: String, default: 'INR' },
    dailyLimit: { type: Number, default: 10000 },
    isFrozen: { type: Boolean, default: false }
  },
  { _id: false }
);

const walletLimitsSchema = new mongoose.Schema(
  {
    monthlyLimit: { type: Number, default: 50000 },
    minBalance: { type: Number, default: 0 }
  },
  { _id: false }
);

const walletSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: true,
      unique: true
    },
    balance: { type: Number, default: 2450 },

    // EMBEDDED DOCUMENT 1: metadata
    metadata: walletMetadataSchema,

    // EMBEDDED DOCUMENT 2: limits
    limits: walletLimitsSchema
  },
  { timestamps: true }
);

module.exports = mongoose.model('Wallet', walletSchema);
