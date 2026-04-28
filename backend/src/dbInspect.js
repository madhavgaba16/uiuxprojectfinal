const mongoose = require('mongoose');
const Post = require('./models/Post');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/driver_app';

async function inspect() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to', MONGODB_URI);

    const count = await Post.countDocuments();
    console.log('Post count:', count);

    const posts = await Post.find().limit(10).lean();
    console.log('Sample posts:', JSON.stringify(posts, null, 2));

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

inspect();