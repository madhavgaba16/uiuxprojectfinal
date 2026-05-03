const mongoose = require('mongoose');

// ============================================
// EMBEDDED DOCUMENT 1: Profile Details
// ============================================
const profileDetailsSchema = new mongoose.Schema(
  {
    bio: { type: String, default: '', trim: true },
    hometown: { type: String, default: '', trim: true },
    ratings: { type: Number, default: 5, min: 0, max: 5 },
    totalRides: { type: Number, default: 0 },
    responseTime: { type: Number, default: 0 } // in minutes
  },
  { _id: true }
);

// ============================================
// EMBEDDED DOCUMENT 2: Location with GeoJSON (Point)
// ============================================
const locationSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['Point'], default: 'Point' },
    // GeoJSON coordinates: [ longitude, latitude ]
    coordinates: { type: [Number], default: [0, 0] },
    address: { type: String, default: '' },
    city: { type: String, default: '' }
  },
  { _id: false }
);

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    licenseNumber: { type: String, required: true, trim: true },
    vehicleNumber: { type: String, required: true, trim: true },
    carModel: { type: String, required: true, trim: true },
    licensePhoto: { type: String, default: null },
    carPhoto: { type: String, default: null },
    trustScore: { type: Number, default: 95 },
    ridesShared: { type: Number, default: 127 },
    alertsPosted: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    
    // ============================================
    // EMBEDDED DOCUMENT 1: Profile Details
    // ============================================
    profileDetails: profileDetailsSchema,
    
    // ============================================
    // EMBEDDED DOCUMENT 2: Current Location (Geospatial)
    // ============================================
    currentLocation: locationSchema,
    
    // Array Operator Example: Tags as Array
    tags: [{ type: String, trim: true }]
  },
  { timestamps: true }
);

// ============================================
// INDEXING STRATEGIES
// ============================================

// 1. SINGLE FIELD INDEX - for phone lookup
driverSchema.index({ phone: 1 });

// 2. TEXT INDEX - for full-text search on name and carModel
driverSchema.index({ name: 'text', carModel: 'text' });

// 3. COMPOUND INDEX - for multiple field queries (trustScore + isActive)
driverSchema.index({ trustScore: -1, isActive: 1 });

// 4. GEOSPATIAL INDEX - use a proper GeoJSON 2dsphere index on `currentLocation`
driverSchema.index({ currentLocation: '2dsphere' });

// 5. MULTIKEY INDEX - for array field (tags)
driverSchema.index({ tags: 1 });

module.exports = mongoose.model('Driver', driverSchema);
