require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const chatRoutes = require('./routes/chatRoutes');
const walletRoutes = require('./routes/walletRoutes');
const Driver = require('./models/Driver');
const Post = require('./models/Post');
const { seedOldChatsForAllDrivers } = require('./utils/seedChats');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/driver_app';

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/wallet', walletRoutes);

async function seedInitialData() {
  const demoDrivers = [
    {
      phone: '9999999999',
      name: 'Community Driver',
      licenseNumber: 'DL-PB11-000000',
      vehicleNumber: 'PB11-CM-0001',
      carModel: 'Swift Dzire',
      trustScore: 97.5,
      ridesShared: 210,
      alertsPosted: 23
    },
    {
      phone: '8888888888',
      name: 'Harpreet Singh',
      licenseNumber: 'DL-PB11-000001',
      vehicleNumber: 'PB11-HP-1001',
      carModel: 'Hyundai i20',
      trustScore: 94.2,
      ridesShared: 156,
      alertsPosted: 11
    },
    {
      phone: '7777777777',
      name: 'Gurdeep Kaur',
      licenseNumber: 'DL-PB11-000002',
      vehicleNumber: 'PB11-GK-2002',
      carModel: 'Honda Amaze',
      trustScore: 96.1,
      ridesShared: 184,
      alertsPosted: 8
    }
  ];

  const drivers = [];
  for (const demoDriver of demoDrivers) {
    const existing = await Driver.findOne({ phone: demoDriver.phone });
    if (existing) {
      drivers.push(existing);
      continue;
    }

    const created = await Driver.create(demoDriver);
    drivers.push(created);
  }

  const postCount = await Post.countDocuments();
  if (postCount === 0) {
    const fallbackDriver = drivers[0];

    await Post.insertMany([
      {
        authorId: fallbackDriver._id,
        category: 'ride',
        title: 'Going to Chandigarh - 3 Seats Available',
        description:
          'Leaving tomorrow morning at 8 AM. Looking for passengers to share fuel costs.',
        pickupPoint: 'Patiala Bus Stand',
        dropPoint: 'Chandigarh Sector 17',
        upvotes: 15,
        downvotes: 2,
        isPublished: true
      },
      {
        authorId: fallbackDriver._id,
        category: 'alert',
        title: 'Heavy Traffic Near Railway Station',
        description:
          'Avoid Railway Road. Major traffic jam due to VIP movement. Take Fountain Chowk route.',
        pickupPoint: 'Railway Station Road',
        upvotes: 23,
        downvotes: 1,
        isPublished: true
      }
    ]);
  }
}

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    await seedInitialData();
    await seedOldChatsForAllDrivers();
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  });
