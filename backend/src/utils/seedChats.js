const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Driver = require('../models/Driver');
const Transaction = require('../models/Transaction');

function getHistoricalTimestamp(offsetMinutes) {
  return new Date(Date.now() - offsetMinutes * 60 * 1000);
}

async function backdateConversation(conversationId, lastMessageAt, messageCount, lastMessage) {
  await Conversation.collection.updateOne(
    { _id: conversationId },
    {
      $set: {
        lastMessage,
        lastMessageAt,
        messageCount,
        updatedAt: lastMessageAt,
        createdAt: lastMessageAt
      }
    }
  );
}

async function backdateMessages(messageRecords) {
  await Promise.all(
    messageRecords.map((record) =>
      Message.collection.updateOne(
        { _id: record._id },
        {
          $set: {
            createdAt: record.createdAt,
            updatedAt: record.createdAt
          }
        }
      )
    )
  );
}

async function backdateTransactions(transactionRecords) {
  await Promise.all(
    transactionRecords.map((record) =>
      Transaction.collection.updateOne(
        { _id: record._id },
        {
          $set: {
            createdAt: record.createdAt,
            updatedAt: record.createdAt
          }
        }
      )
    )
  );
}

async function seedOldChatsForDriver(driver, options = {}) {
  if (!driver?._id) return;

  const limit = options.limit; // if provided, limit the number of other drivers
  let otherDriversQuery = Driver.find({ _id: { $ne: driver._id } }).sort({ createdAt: 1 });
  if (limit) otherDriversQuery = otherDriversQuery.limit(limit);
  const otherDrivers = await otherDriversQuery;

  for (let index = 0; index < otherDrivers.length; index += 1) {
    const otherDriver = otherDrivers[index];
    const existingConversation = await Conversation.findOne({
      participants: { $all: [driver._id, otherDriver._id] },
      'participants.1': { $exists: true }
    });

    if (existingConversation) {
      continue;
    }

    const baseOffsetMinutes = 60 * 24 * (7 + index * 2);
    const messageTimes = [
      getHistoricalTimestamp(baseOffsetMinutes + 30),
      getHistoricalTimestamp(baseOffsetMinutes + 20),
      getHistoricalTimestamp(baseOffsetMinutes + 10)
    ];

    const conversation = await Conversation.create({
      participants: [driver._id, otherDriver._id],
      settings: {
        isMuted: false,
        isBlocked: false,
        isArchived: false
      },
      lastMessage: '',
      lastMessageAt: messageTimes[2],
      messageCount: 0
    });

    const messages = await Message.insertMany([
      {
        conversationId: conversation._id,
        senderId: otherDriver._id,
        content: `Hey ${driver.name}, I saw your ride update from last week. Are you still traveling the same route?`,
        metadata: { isRead: true, readAt: messageTimes[0], isPinned: false, reactions: [] },
        isDeleted: false,
        editedAt: null
      },
      {
        conversationId: conversation._id,
        senderId: driver._id,
        content: 'Yes, I was doing that route regularly. I usually leave around 9 AM on weekdays.',
        metadata: { isRead: true, readAt: messageTimes[1], isPinned: false, reactions: [] },
        isDeleted: false,
        editedAt: null
      },
      {
        conversationId: conversation._id,
        senderId: otherDriver._id,
        content: 'Perfect. Let me know if you have any free seats again. I may join the next few trips.',
        metadata: { isRead: true, readAt: messageTimes[2], isPinned: false, reactions: [] },
        isDeleted: false,
        editedAt: null
      }
    ]);

    await backdateMessages([
      { _id: messages[0]._id, createdAt: messageTimes[0] },
      { _id: messages[1]._id, createdAt: messageTimes[1] },
      { _id: messages[2]._id, createdAt: messageTimes[2] }
    ]);

    await backdateConversation(conversation._id, messageTimes[2], 3, messages[2].content);
  }

  const existingTransactionCount = await Transaction.countDocuments({ driverId: driver._id });
  if (existingTransactionCount === 0) {
    const transactionTimes = [
      getHistoricalTimestamp(60 * 24 * 12),
      getHistoricalTimestamp(60 * 24 * 10),
      getHistoricalTimestamp(60 * 24 * 8)
    ];

    const transactions = await Transaction.insertMany([
      {
        driverId: driver._id,
        type: 'credit',
        amount: 500,
        description: 'Welcome bonus credited',
        details: { paymentMethod: 'wallet', referenceId: `WELCOME-${driver._id.toString().slice(-6)}`, status: 'success' },
        isVerified: true,
        tags: ['welcome', 'bonus']
      },
      {
        driverId: driver._id,
        type: 'credit',
        amount: 1200,
        description: 'Old ride earnings - Patiala to Chandigarh',
        details: { paymentMethod: 'wallet', referenceId: `RIDE-${driver._id.toString().slice(-6)}-1`, status: 'success' },
        isVerified: true,
        tags: ['ride', 'earnings']
      },
      {
        driverId: driver._id,
        type: 'debit',
        amount: 30,
        description: 'Commission deducted for a completed ride',
        details: { paymentMethod: 'wallet', referenceId: `COM-${driver._id.toString().slice(-6)}-1`, status: 'success' },
        isVerified: true,
        tags: ['commission']
      }
    ]);

    await backdateTransactions([
      { _id: transactions[0]._id, createdAt: transactionTimes[0] },
      { _id: transactions[1]._id, createdAt: transactionTimes[1] },
      { _id: transactions[2]._id, createdAt: transactionTimes[2] }
    ]);
  }
}

async function seedOldChatsForAllDrivers() {
  const drivers = await Driver.find().sort({ createdAt: 1 });
  for (const driver of drivers) {
    await seedOldChatsForDriver(driver);
  }
}

module.exports = {
  seedOldChatsForDriver,
  seedOldChatsForAllDrivers
};