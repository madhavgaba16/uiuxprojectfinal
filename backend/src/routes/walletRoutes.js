const express = require('express');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');

const router = express.Router();

async function getWalletAndTransactions(driverId) {
  const wallet = await Wallet.findOneAndUpdate(
    { driverId },
    { $setOnInsert: { driverId, balance: 2450 } },
    { upsert: true, new: true }
  );

  const transactions = await Transaction.find({ driverId }).sort({ createdAt: -1 });

  return {
    balance: wallet.balance,
    transactions: transactions.map((t) => ({
      id: t._id.toString(),
      type: t.type,
      amount: t.amount,
      description: t.description,
      date: new Date(t.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      time: new Date(t.createdAt).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }))
  };
}

// ============================================
// READ OPERATION with Wallet balance
// ============================================
router.get('/:driverId', async (req, res) => {
  try {
    const payload = await getWalletAndTransactions(req.params.driverId);
    res.json(payload);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load wallet', error: error.message });
  }
});

// ============================================
// CREATE OPERATION with $inc operator (Increment)
// ============================================
router.post('/:driverId/add', async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // UPDATE OPERATION: Using $inc operator to increment balance
    await Wallet.updateOne(
      { driverId: req.params.driverId },
      { $inc: { balance: amount } },
      { upsert: true }
    );
    
    // CREATE OPERATION: Create transaction record
    await Transaction.create({
      driverId: req.params.driverId,
      type: 'credit',
      amount,
      description: 'Money added to wallet',
      details: {
        paymentMethod: 'card',
        referenceId: '',
        status: 'success'
      }
    });

    const payload = await getWalletAndTransactions(req.params.driverId);
    res.status(201).json(payload);
  } catch (error) {
    res.status(500).json({ message: 'Unable to add money', error: error.message });
  }
});

// ============================================
// UPDATE OPERATION with COMPARISON OPERATOR ($gte)
// ============================================
router.post('/:driverId/withdraw', async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    const accountSuffix = String(req.body.accountNumber || '').slice(-4);

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // COMPARISON OPERATOR: $gte (greater than or equal to) - check balance
    const wallet = await Wallet.findOneAndUpdate(
      {
        driverId: req.params.driverId,
        balance: { $gte: amount }
      },
      { $inc: { balance: -amount } },
      { new: true }
    );

    if (!wallet) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // CREATE OPERATION: Create debit transaction
    await Transaction.create({
      driverId: req.params.driverId,
      type: 'debit',
      amount,
      description: `Withdrawn to ${accountSuffix || 'bank'}`,
      details: {
        paymentMethod: 'bank',
        referenceId: `TXN-${Date.now()}`,
        status: 'success'
      }
    });

    const payload = await getWalletAndTransactions(req.params.driverId);
    res.status(201).json(payload);
  } catch (error) {
    res.status(500).json({ message: 'Unable to withdraw', error: error.message });
  }
});

// ============================================
// AGGREGATION PIPELINE 1: Monthly Transaction Summary
// Shows aggregation with $group, $sum, $match operators
// ============================================
router.get('/:driverId/monthly-summary', async (req, res) => {
  try {
    const driverId = req.params.driverId;

    // AGGREGATION PIPELINE
    const summary = await Transaction.aggregate([
      // COMPARISON OPERATOR: $match with $eq to filter by driverId
      {
        $match: {
          driverId: require('mongoose').Types.ObjectId(driverId)
        }
      },
      
      // GROUP and SUM operations
      {
        $group: {
          _id: { type: '$type' },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      
      // SORT by type
      {
        $sort: { '_id.type': 1 }
      }
    ]);

    res.json({ summary });
  } catch (error) {
    res.status(500).json({ message: 'Unable to generate summary', error: error.message });
  }
});

// ============================================
// AGGREGATION PIPELINE 2: Top Transaction Analysis
// Shows aggregation with $facet, $bucket, and $limit
// ============================================
router.get('/:driverId/analytics', async (req, res) => {
  try {
    const driverId = req.params.driverId;

    // AGGREGATION PIPELINE with multiple facets
    const analytics = await Transaction.aggregate([
      // COMPARISON OPERATOR: $gte to filter transactions
      {
        $match: {
          driverId: require('mongoose').Types.ObjectId(driverId)
        }
      },
      
      // Use $facet for multiple sub-pipelines
      {
        $facet: {
          // Facet 1: High value transactions
          highValueTransactions: [
            {
              $match: {
                amount: { $gte: 1000 }
              }
            },
            { $sort: { amount: -1 } },
            { $limit: 5 }
          ],
          
          // Facet 2: Transaction type distribution
          typeDistribution: [
            {
              $group: {
                _id: '$type',
                count: { $sum: 1 },
                totalAmount: { $sum: '$amount' }
              }
            }
          ],
          
          // Facet 3: Recent transactions with ELEMENT OPERATOR ($exists check)
          recentTransactions: [
            {
              $match: {
                isVerified: { $exists: true }
              }
            },
            { $sort: { createdAt: -1 } },
            { $limit: 10 }
          ]
        }
      }
    ]);

    res.json({ analytics: analytics[0] });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch analytics', error: error.message });
  }
});

// ============================================
// ARRAY OPERATOR: $push to add tag
// ============================================
router.post('/:driverId/tag-transaction', async (req, res) => {
  try {
    const { driverId } = req.params;
    const { transactionId, tag } = req.body;

    if (!tag) {
      return res.status(400).json({ message: 'Tag is required' });
    }

    // ARRAY OPERATOR: $push - adds element to array
    const transaction = await Transaction.findByIdAndUpdate(
      transactionId,
      { $push: { tags: tag } },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ transaction });
  } catch (error) {
    res.status(500).json({ message: 'Unable to tag transaction', error: error.message });
  }
});

// ============================================
// ARRAY OPERATOR: $pull to remove tag
// ============================================
router.delete('/:driverId/remove-tag', async (req, res) => {
  try {
    const { driverId } = req.params;
    const { transactionId, tag } = req.body;

    // ARRAY OPERATOR: $pull - removes elements from array
    const transaction = await Transaction.findByIdAndUpdate(
      transactionId,
      { $pull: { tags: tag } },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ transaction });
  } catch (error) {
    res.status(500).json({ message: 'Unable to remove tag', error: error.message });
  }
});

// ============================================
// LOGICAL OPERATOR: $and, $or for complex queries
// ============================================
router.get('/:driverId/filtered-transactions', async (req, res) => {
  try {
    const { driverId } = req.params;
    const { minAmount, maxAmount, type, isVerified } = req.query;

    // LOGICAL OPERATOR: $and with COMPARISON OPERATORS
    let query = {
      driverId: require('mongoose').Types.ObjectId(driverId),
      $and: [
        { amount: { $gte: parseInt(minAmount) || 0 } },
        { amount: { $lte: parseInt(maxAmount) || 100000 } }
      ]
    };

    // LOGICAL OPERATOR: $or for type or verification
    if (type || isVerified) {
      query.$or = [];
      if (type) query.$or.push({ type: type });
      if (isVerified) query.$or.push({ isVerified: isVerified === 'true' });
    }

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch transactions', error: error.message });
  }
});

router.post('/:driverId/commission', async (req, res) => {
  try {
    const amount = Number(req.body.amount || 30);
    const description = req.body.description || 'Commission deducted';

    const wallet = await Wallet.findOneAndUpdate(
      {
        driverId: req.params.driverId,
        balance: { $gte: amount }
      },
      { $inc: { balance: -amount } },
      { new: true }
    );

    if (!wallet) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    await Transaction.create({
      driverId: req.params.driverId,
      type: 'debit',
      amount,
      description
    });

    const payload = await getWalletAndTransactions(req.params.driverId);
    res.status(201).json(payload);
  } catch (error) {
    res.status(500).json({ message: 'Unable to deduct commission', error: error.message });
  }
});

module.exports = router;
