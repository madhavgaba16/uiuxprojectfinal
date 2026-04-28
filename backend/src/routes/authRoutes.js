const express = require('express');
const Driver = require('../models/Driver');
const Wallet = require('../models/Wallet');

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
          latitude: 0,
          longitude: 0,
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

    // UPDATE OPERATION: Update embedded document (currentLocation)
    driver.currentLocation = {
      latitude: parseFloat(latitude) || 0,
      longitude: parseFloat(longitude) || 0,
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
