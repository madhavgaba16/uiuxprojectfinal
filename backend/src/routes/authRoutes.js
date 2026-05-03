const express = require('express');
const Driver = require('../models/Driver');
const Wallet = require('../models/Wallet');
const Post = require('../models/Post');
const Transaction = require('../models/Transaction');
const { seedOldChatsForDriver } = require('../utils/seedChats');

const router = express.Router();

// ============================================
// CREATE OPERATION
// ============================================
router.post('/login-register', async (req, res) => {
  try {
    const {
      name,
      phone,
      licenseNumber,
      vehicleNumber,
      carModel,
      licensePhoto,
      carPhoto
    } = req.body;

    if (!name || !phone || !licenseNumber || !vehicleNumber || !carModel) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // ============================================
    // READ OPERATION with COMPARISON OPERATOR ($eq)
    // ============================================
    let driver = await Driver.findOne({ phone: { $eq: phone.trim() } });

    if (!driver) {
      // CREATE OPERATION: Creating new driver with embedded documents
      driver = await Driver.create({
        name: name.trim(),
        phone: phone.trim(),
        licenseNumber: licenseNumber.trim(),
        vehicleNumber: vehicleNumber.trim(),
        carModel: carModel.trim(),
        licensePhoto: licensePhoto || null,
        carPhoto: carPhoto || null,
        
        // EMBEDDED DOCUMENT 1: Profile Details
        profileDetails: {
          bio: '',
          hometown: '',
          ratings: 5,
          totalRides: 0,
          responseTime: 0
        },
        
        // EMBEDDED DOCUMENT 2: Current Location
        currentLocation: {
          type: 'Point',
          coordinates: [0, 0], // [lng, lat]
          address: '',
          city: ''
        },
        
        tags: ['new-driver']
      });
    } else {
      // UPDATE OPERATION with various operators
      driver.name = name.trim();
      driver.licenseNumber = licenseNumber.trim();
      driver.vehicleNumber = vehicleNumber.trim();
      driver.carModel = carModel.trim();
      driver.licensePhoto = licensePhoto || driver.licensePhoto;
      driver.carPhoto = carPhoto || driver.carPhoto;
      await driver.save();
    }

    // UPSERT (Update if exists, else Insert) with $setOnInsert operator
    await Wallet.updateOne(
      { driverId: driver._id },
      { $setOnInsert: { driverId: driver._id, balance: 2450 } },
      { upsert: true }
    );

    await seedOldChatsForDriver(driver);

    // Seed dummy data for new drivers only
    const existingPosts = await Post.countDocuments({ authorId: driver._id });
    if (existingPosts === 0) {
      await Post.insertMany([
        {
          authorId: driver._id,
          category: 'ride',
          title: 'Going to Chandigarh - 2 Seats Available',
          description: 'Leaving tomorrow morning at 8 AM from Patiala Bus Stand. Sharing fuel costs. AC car, comfortable ride.',
          pickupPoint: 'Patiala Bus Stand',
          dropPoint: 'Chandigarh Sector 17',
          upvotes: 12,
          downvotes: 1,
          isPublished: true,
          analytics: { views: 45, shares: 3, engagementScore: 10 },
          tags: ['chandigarh', 'morning-ride']
        },
        {
          authorId: driver._id,
          category: 'alert',
          title: 'Heavy Traffic Near Railway Station',
          description: 'Avoid Railway Road between 5-7 PM. Major congestion due to construction work. Take Fountain Chowk alternate route instead.',
          pickupPoint: 'Railway Station Road',
          upvotes: 28,
          downvotes: 2,
          isPublished: true,
          analytics: { views: 120, shares: 8, engagementScore: 24 },
          tags: ['traffic', 'patiala']
        },
        {
          authorId: driver._id,
          category: 'ride',
          title: 'Daily Commute to Rajpura - Carpool',
          description: 'Looking for regular carpool partners for Patiala to Rajpura route. Monday to Friday, 9 AM departure.',
          pickupPoint: 'Leela Bhawan',
          dropPoint: 'Rajpura Bus Stand',
          upvotes: 8,
          downvotes: 0,
          isPublished: true,
          analytics: { views: 32, shares: 2, engagementScore: 8 },
          tags: ['carpool', 'daily']
        },
        {
          authorId: driver._id,
          category: 'alert',
          title: 'Fog Warning - Drive Slow on NH-64',
          description: 'Dense fog reported on National Highway 64 between Patiala and Sirhind. Visibility below 50 meters. Use fog lights and drive under 40 km/h.',
          pickupPoint: 'NH-64 Patiala-Sirhind',
          upvotes: 35,
          downvotes: 0,
          isPublished: true,
          analytics: { views: 200, shares: 15, engagementScore: 35 },
          tags: ['fog', 'safety', 'highway']
        },
        {
          authorId: driver._id,
          category: 'ride',
          title: 'Airport Drop - Mohali Airport',
          description: 'Going to Chandigarh Airport tomorrow at 4 AM for an early morning flight drop. Can pick up 3 passengers along the way.',
          pickupPoint: 'Patiala Urban Estate',
          dropPoint: 'Mohali International Airport',
          upvotes: 5,
          downvotes: 0,
          isPublished: true,
          analytics: { views: 18, shares: 1, engagementScore: 5 },
          tags: ['airport', 'early-morning']
        }
      ]);

    }

    res.json({ driver });
  } catch (error) {
    res.status(500).json({ message: 'Unable to login/register driver', error: error.message });
  }
});

// ============================================
// READ with LOGICAL OPERATOR ($and, $or)
// ============================================
router.get('/search', async (req, res) => {
  try {
    const { name, minTrustScore, maxTrustScore, isActive } = req.query;

    // LOGICAL OPERATOR: $and (implicit in MongoDB)
    // COMPARISON OPERATORS: $gte, $lte
    let query = {
      $and: [
        { isActive: { $eq: isActive !== 'false' } },
        { trustScore: { $gte: parseInt(minTrustScore) || 0 } },
        { trustScore: { $lte: parseInt(maxTrustScore) || 100 } }
      ]
    };

    // LOGICAL OPERATOR: $or for name or carModel match
    if (name) {
      query = {
        $and: [
          query,
          {
            $or: [
              { name: { $regex: name, $options: 'i' } },
              { carModel: { $regex: name, $options: 'i' } }
            ]
          }
        ]
      };
    }

    const drivers = await Driver.find(query).limit(10);
    res.json({ drivers });
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
});

// ============================================
// UPDATE with ARRAY OPERATOR ($push, $addToSet)
// ============================================
router.post('/:driverId/tags', async (req, res) => {
  try {
    const { driverId } = req.params;
    const { tag } = req.body;

    if (!tag) {
      return res.status(400).json({ message: 'Tag is required' });
    }

    // ARRAY OPERATOR: $addToSet - adds only if unique
    const driver = await Driver.findByIdAndUpdate(
      driverId,
      { $addToSet: { tags: tag } },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.json({ driver });
  } catch (error) {
    res.status(500).json({ message: 'Unable to add tag', error: error.message });
  }
});

// ============================================
// UPDATE with ELEMENT OPERATOR ($exists, $type)
// ============================================
router.post('/:driverId/update-location', async (req, res) => {
  try {
    const { driverId } = req.params;
    const { latitude, longitude, address, city } = req.body;

    // ELEMENT OPERATOR: Check if currentLocation exists
    let driver = await Driver.findById(driverId);
    
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // UPDATE OPERATION: Update embedded document (currentLocation) as GeoJSON Point
    driver.currentLocation = {
      type: 'Point',
      coordinates: [parseFloat(longitude) || 0, parseFloat(latitude) || 0], // [lng, lat]
      address: address || '',
      city: city || ''
    };

    await driver.save();
    res.json({ driver });
  } catch (error) {
    res.status(500).json({ message: 'Unable to update location', error: error.message });
  }
});

// ============================================
// DELETE OPERATION with LOGICAL OPERATOR ($nor)
// ============================================
router.delete('/:driverId', async (req, res) => {
  try {
    const { driverId } = req.params;

    // LOGICAL OPERATOR: $nor - neither isActive true nor trustScore >= 50 (inactive + low trust)
    const driver = await Driver.findByIdAndDelete(driverId);

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.json({ message: 'Driver deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete driver', error: error.message });
  }
});

// ============================================
// COMPARISON OPERATOR: $ne (not equal)
// ============================================
router.get('/inactive-drivers', async (req, res) => {
  try {
    // COMPARISON OPERATOR: $ne - find drivers that are NOT active
    const drivers = await Driver.find({ isActive: { $ne: true } });
    res.json({ drivers });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch inactive drivers', error: error.message });
  }
});

// ============================================
// COMPARISON OPERATORS: $gt, $lt
// ============================================
router.get('/high-performers', async (req, res) => {
  try {
    // COMPARISON OPERATORS: $gt (greater than), $lt (less than)
    const drivers = await Driver.find({
      trustScore: { $gt: 85 },
      ridesShared: { $gt: 50 },
      alertsPosted: { $lt: 5 }
    }).sort({ trustScore: -1 });

    res.json({ drivers });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch high performers', error: error.message });
  }
});

module.exports = router;
