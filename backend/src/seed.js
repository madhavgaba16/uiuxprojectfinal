const mongoose = require('mongoose');
const Driver = require('./models/Driver');
const Post = require('./models/Post');
const Conversation = require('./models/Conversation');
const Message = require('./models/Message');

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/driver-community');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Driver.deleteMany({});
    await Post.deleteMany({});
    await Conversation.deleteMany({});
    await Message.deleteMany({});
    console.log('Cleared existing data');

    // Create sample drivers
    const drivers = await Driver.create([
      {
        name: 'Rajesh Kumar',
        phone: '+919876543210',
        licenseNumber: 'DL-2024-001',
        vehicleNumber: 'DL01AB1234',
        carModel: 'Honda City',
        trustScore: 98,
        isActive: true,
        profileDetails: {
          bio: 'Professional driver with 5 years experience',
          hometown: 'Delhi',
          ratings: 4.8,
          totalRides: 250,
          responseTime: 2
        },
        currentLocation: {
          latitude: 28.6139,
          longitude: 77.2090,
          address: 'Sector 5, Dwarka',
          city: 'Delhi'
        },
        tags: ['verified', 'experienced']
      },
      {
        name: 'Priya Sharma',
        phone: '+919876543211',
        licenseNumber: 'DL-2024-002',
        vehicleNumber: 'DL02CD5678',
        carModel: 'Maruti Swift',
        trustScore: 95,
        isActive: true,
        profileDetails: {
          bio: 'Friendly and punctual driver',
          hometown: 'Gurgaon',
          ratings: 4.7,
          totalRides: 180,
          responseTime: 3
        },
        currentLocation: {
          latitude: 28.4595,
          longitude: 77.0266,
          address: 'Sector 12, Gurgaon',
          city: 'Gurgaon'
        },
        tags: ['friendly', 'verified']
      },
      {
        name: 'Amit Singh',
        phone: '+919876543212',
        licenseNumber: 'DL-2024-003',
        vehicleNumber: 'DL03EF9012',
        carModel: 'Hyundai i20',
        trustScore: 92,
        isActive: true,
        profileDetails: {
          bio: 'Safe and comfortable rides',
          hometown: 'Noida',
          ratings: 4.6,
          totalRides: 150,
          responseTime: 4
        },
        currentLocation: {
          latitude: 28.5921,
          longitude: 77.3217,
          address: 'Sector 18, Noida',
          city: 'Noida'
        },
        tags: ['safe', 'comfortable']
      }
    ]);

    console.log(`Created ${drivers.length} sample drivers`);

    // Create sample posts
    const posts = await Post.create([
      {
        authorId: drivers[0]._id,
        category: 'ride',
        title: 'Delhi to Airport',
        description: 'Need to pick up 2 passengers going to airport. Comfortable AC car available.',
        pickupPoint: 'Sector 5, Dwarka',
        dropPoint: 'Delhi Airport Terminal 3',
        customerDetails: 'Flight at 6 PM',
        upvotes: 5,
        downvotes: 0,
        comments: [],
        analytics: {
          views: 45,
          shares: 2,
          engagementScore: 15,
          isSponsored: false
        },
        tags: ['airport', 'express'],
        isPublished: true
      },
      {
        authorId: drivers[1]._id,
        category: 'alert',
        title: 'Gurgaon Traffic Alert',
        description: 'Heavy traffic on Golf Course Road. Suggest alternate route via MG Road.',
        pickupPoint: 'Golf Course Road',
        dropPoint: 'MG Road',
        customerDetails: 'Traffic update for commuters',
        upvotes: 12,
        downvotes: 1,
        comments: [],
        analytics: {
          views: 89,
          shares: 8,
          engagementScore: 32,
          isSponsored: false
        },
        tags: ['traffic', 'alert'],
        isPublished: true
      },
      {
        authorId: drivers[2]._id,
        category: 'ride',
        title: 'Airport to Noida',
        description: 'Starting from Delhi Airport, heading to Noida. Can pick up 1-2 passengers.',
        pickupPoint: 'Delhi Airport',
        dropPoint: 'Sector 18, Noida',
        customerDetails: 'Sharing ride',
        upvotes: 8,
        downvotes: 0,
        comments: [],
        analytics: {
          views: 56,
          shares: 3,
          engagementScore: 18,
          isSponsored: false
        },
        tags: ['airport', 'noida', 'sharing'],
        isPublished: true
      },
      {
        authorId: drivers[0]._id,
        category: 'alert',
        title: 'Best Parking Spot at Hauz Khas',
        description: 'Free parking available at Hauz Khas basement. Best time is 10 AM - 2 PM.',
        pickupPoint: 'Hauz Khas Village',
        dropPoint: 'Hauz Khas Basement',
        customerDetails: 'Parking tip for drivers',
        upvotes: 18,
        downvotes: 0,
        comments: [],
        analytics: {
          views: 120,
          shares: 15,
          engagementScore: 45,
          isSponsored: false
        },
        tags: ['parking', 'tip', 'hauz-khas'],
        isPublished: true
      },
      {
        authorId: drivers[1]._id,
        category: 'ride',
        title: 'Mall of India Trip',
        description: 'Going to Mall of India from Gurgaon. Can take 2-3 passengers. Comfortable journey.',
        pickupPoint: 'Sector 12, Gurgaon',
        dropPoint: 'Mall of India',
        customerDetails: 'Shopping trip',
        upvotes: 6,
        downvotes: 0,
        comments: [],
        analytics: {
          views: 38,
          shares: 1,
          engagementScore: 8,
          isSponsored: false
        },
        tags: ['mall', 'gurgaon'],
        isPublished: true
      }
    ]);

    console.log(`Created ${posts.length} sample posts`);

    // Create sample conversations
    const conversation = await Conversation.create({
      participants: [drivers[0]._id, drivers[1]._id],
      settings: {
        isMuted: false,
        isBlocked: false,
        isArchived: false
      },
      messageCount: 0,
      lastMessageAt: new Date()
    });

    console.log('Created sample conversation');

    // Create sample messages
    await Message.create([
      {
        conversationId: conversation._id,
        senderId: drivers[0]._id,
        content: 'Hi Priya! Are you available for the airport run today?',
        metadata: {
          isRead: true,
          readAt: new Date(),
          isPinned: false,
          reactions: ['👍']
        }
      },
      {
        conversationId: conversation._id,
        senderId: drivers[1]._id,
        content: 'Yes, I am! When do you need to go?',
        metadata: {
          isRead: true,
          readAt: new Date(),
          isPinned: false,
          reactions: []
        }
      },
      {
        conversationId: conversation._id,
        senderId: drivers[0]._id,
        content: 'Around 4 PM. Can you pick me up from Dwarka?',
        metadata: {
          isRead: true,
          readAt: new Date(),
          isPinned: false,
          reactions: []
        }
      }
    ]);

    console.log('Created sample messages');

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
