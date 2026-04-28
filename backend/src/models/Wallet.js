const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: true,
      unique: true
    },
    balance: { type: Number, default: 2450 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Wallet', walletSchema);
