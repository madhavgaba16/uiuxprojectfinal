const express = require('express');
const Post = require('../models/Post');
const Driver = require('../models/Driver');
const { timeAgo } = require('../utils/timeAgo');

const router = express.Router();

function toClientPost(postDoc) {
  const post = postDoc.toObject ? postDoc.toObject() : postDoc;
  const author = post.authorId || null;
  const authorObjectId = author && author._id ? author._id : author;
  return {
    id: post._id.toString(),
    authorId: authorObjectId ? authorObjectId.toString() : '',
    authorName: author?.name || post.authorName || 'Driver',
    vehicleNumber: author?.vehicleNumber || post.vehicleNumber || 'PB11-XX-XXXX',
    trustScore: author?.trustScore || post.trustScore || 95,
    category: post.category,
    title: post.title,
    description: post.description,
    pickup: post.pickupPoint,
    drop: post.dropPoint,
    customerDetails: post.customerDetails,
    upvotes: post.upvotes,
    downvotes: post.downvotes,
    views: post.analytics?.views || 0,
    comments: (post.comments || []).map((c) => ({
      id: c._id.toString(),
      author: c.authorName,
      text: c.text,
      time: timeAgo(c.createdAt)
    })),
    timeAgo: timeAgo(post.createdAt)
  };
}

// ============================================
// READ OPERATION with ELEMENT OPERATOR ($exists)
// ============================================
router.get('/', async (req, res) => {
  try {
    // ELEMENT OPERATOR: $exists - find published posts that exist
    const posts = await Post.find({ isPublished: { $exists: true, $eq: true } })
      .populate('authorId', 'name vehicleNumber trustScore')
      .sort({ createdAt: -1 });

    res.json({ posts: posts.map(toClientPost) });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch posts', error: error.message });
  }
});

// ============================================
// CREATE OPERATION with EMBEDDED DOCUMENTS
// ============================================
router.post('/', async (req, res) => {
  try {
    const {
      driverId,
      category,
      title,
      description,
      pickupPoint,
      dropPoint,
      customerDetails,
      tags
    } = req.body;

    if (!driverId || !category || !title || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // CREATE OPERATION with EMBEDDED DOCUMENTS
    const post = await Post.create({
      authorId: driver._id,
      category,
      title,
      description,
      pickupPoint: pickupPoint || '',
      dropPoint: dropPoint || '',
      customerDetails: customerDetails || '',
      
      // EMBEDDED DOCUMENT 1: Comments (initialized empty)
      comments: [],
      
      // EMBEDDED DOCUMENT 2: Analytics
      analytics: {
        views: 0,
        shares: 0,
        engagementScore: 0,
        isSponsored: false
      },
      
      tags: tags || [],
      isPublished: true,
      isArchived: false,
      isPinned: false
    });

    if (category === 'ride') {
      driver.ridesShared += 1;
      driver.trustScore = Math.min(100, driver.trustScore + 0.5);
    } else {
      driver.alertsPosted += 1;
    }
    await driver.save();

    const populated = await Post.findById(post._id).populate('authorId', 'name vehicleNumber trustScore');
    res.status(201).json({ post: toClientPost(populated) });
  } catch (error) {
    res.status(500).json({ message: 'Unable to create post', error: error.message });
  }
});

// ============================================
// UPDATE OPERATION with COMPARISON OPERATORS ($gt, $lt)
// ============================================
router.post('/:postId/vote', async (req, res) => {
  try {
    const { postId } = req.params;
    const { type } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (type === 'upvote') post.upvotes += 1;
    if (type === 'downvote') post.downvotes += 1;

    // COMPARISON OPERATOR: $gte (greater than or equal to)
    // DELETE OPERATION: when downvotes reach 10
    if (post.downvotes >= 10) {
      await Post.deleteOne({ _id: post._id });
      return res.json({ removed: true });
    }

    // UPDATE OPERATION: Update analytics
    post.analytics.engagementScore = post.upvotes - (post.downvotes * 2);
    
    await post.save();
    res.json({ removed: false });
  } catch (error) {
    res.status(500).json({ message: 'Unable to vote post', error: error.message });
  }
});

// ============================================
// UPDATE OPERATION with ARRAY OPERATOR ($push)
// ============================================
router.post('/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    const { driverId, text } = req.body;

    if (!driverId || !text || !text.trim()) {
      return res.status(400).json({ message: 'Missing required comment fields' });
    }

    const [post, driver] = await Promise.all([
      Post.findById(postId),
      Driver.findById(driverId)
    ]);

    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (!driver) return res.status(404).json({ message: 'Driver not found' });

    // ARRAY OPERATOR: $push - adds comment to embedded document array
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            authorId: driver._id,
            authorName: driver.name,
            text: text.trim(),
            isEdited: false,
            likes: 0
          }
        },
        // Also increment engagement
        $inc: { 'analytics.engagementScore': 1 }
      },
      { new: true }
    );

    res.status(201).json({
      comment: {
        author: driver.name,
        text: text.trim(),
        time: 'Just now'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to add comment', error: error.message });
  }
});

// ============================================
// UPDATE OPERATION with ARRAY OPERATOR ($pull)
// ============================================
router.delete('/:postId/comments/:commentId', async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    // ARRAY OPERATOR: $pull - removes comment from array
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { comments: { _id: commentId } },
        $inc: { 'analytics.engagementScore': -1 }
      },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete comment', error: error.message });
  }
});

// ============================================
// READ with LOGICAL OPERATORS ($and, $or, $nor)
// ============================================
router.get('/search/:term', async (req, res) => {
  try {
    const { term } = req.params;
    const { category, minUpvotes, maxDownvotes } = req.query;

    // LOGICAL OPERATOR: $and (implicit) with COMPARISON OPERATORS
    let query = {
      $and: [
        { isPublished: true },
        { isArchived: false },
        { upvotes: { $gte: parseInt(minUpvotes) || 0 } },
        { downvotes: { $lte: parseInt(maxDownvotes) || 100 } }
      ]
    };

    // LOGICAL OPERATOR: $or for text search
    query.$or = [
      { title: { $regex: term, $options: 'i' } },
      { description: { $regex: term, $options: 'i' } }
    ];

    // Add category filter if provided
    if (category) {
      query.category = { $eq: category };
    }

    const posts = await Post.find(query)
      .populate('authorId', 'name vehicleNumber trustScore')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ posts: posts.map(toClientPost) });
  } catch (error) {
    res.status(500).json({ message: 'Unable to search posts', error: error.message });
  }
});

// ============================================
// AGGREGATION PIPELINE 1: Posts by Category with Statistics
// ============================================
router.get('/analytics/category-stats', async (req, res) => {
  try {
    // AGGREGATION PIPELINE
    const stats = await Post.aggregate([
      // COMPARISON OPERATOR: $match with $eq
      {
        $match: { isPublished: { $eq: true } }
      },
      
      // GROUP by category with aggregation functions
      {
        $group: {
          _id: '$category',
          totalPosts: { $sum: 1 },
          avgUpvotes: { $avg: '$upvotes' },
          avgDownvotes: { $avg: '$downvotes' },
          totalViews: { $sum: '$analytics.views' },
          maxEngagement: { $max: '$analytics.engagementScore' }
        }
      },
      
      // SORT by total posts
      {
        $sort: { totalPosts: -1 }
      }
    ]);

    res.json({ stats });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch category stats', error: error.message });
  }
});

// ============================================
// AGGREGATION PIPELINE 2: Top Performing Posts with Comment Analysis
// ============================================
router.get('/analytics/top-posts', async (req, res) => {
  try {
    // COMPLEX AGGREGATION with $facet and $lookup
    const analysis = await Post.aggregate([
      // Initial match - COMPARISON OPERATOR: $gt
      {
        $match: {
          isPublished: true,
          upvotes: { $gt: 0 }
        }
      },
      
      // Add computed fields
      {
        $addFields: {
          commentCount: { $size: '$comments' },
          engagementScore: {
            $add: [
              '$upvotes',
              { $multiply: ['$analytics.views', 0.1] },
              { $multiply: ['$analytics.shares', 2] }
            ]
          }
        }
      },
      
      // Use $facet for multiple aggregations
      {
        $facet: {
          // Top posts by engagement
          topByEngagement: [
            { $sort: { engagementScore: -1 } },
            { $limit: 5 },
            { $project: { title: 1, engagementScore: 1, upvotes: 1, commentCount: 1 } }
          ],
          
          // Most commented posts
          mostCommented: [
            { $sort: { commentCount: -1 } },
            { $limit: 5 },
            { $project: { title: 1, commentCount: 1, 'comments.text': 1 } }
          ],
          
          // Posts by category distribution
          categoryDistribution: [
            {
              $group: {
                _id: '$category',
                count: { $sum: 1 }
              }
            }
          ]
        }
      }
    ]);

    res.json({ analysis: analysis[0] });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch post analytics', error: error.message });
  }
});

// ============================================
// ARRAY OPERATOR: $addToSet for unique tags
// ============================================
router.post('/:postId/add-tag', async (req, res) => {
  try {
    const { postId } = req.params;
    const { tag } = req.body;

    if (!tag) {
      return res.status(400).json({ message: 'Tag is required' });
    }

    // ARRAY OPERATOR: $addToSet - adds only if unique
    const post = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { tags: tag } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ post });
  } catch (error) {
    res.status(500).json({ message: 'Unable to add tag', error: error.message });
  }
});

// ============================================
// ELEMENT OPERATOR: $type for field type checking
// ============================================
router.get('/advanced/by-type', async (req, res) => {
  try {
    // ELEMENT OPERATOR: $type - find posts where description is string
    const posts = await Post.find({
      description: { $type: 'string' },
      isPublished: true
    }).limit(10);

    res.json({ posts: posts.map(toClientPost) });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch posts', error: error.message });
  }
});

// ============================================
// LOGICAL OPERATOR: $nor (neither... nor)
// ============================================
router.get('/advanced/neutral-posts', async (req, res) => {
  try {
    // LOGICAL OPERATOR: $nor - neither upvotes >= 50 nor downvotes >= 10
    const posts = await Post.find({
      $nor: [
        { upvotes: { $gte: 50 } },
        { downvotes: { $gte: 10 } }
      ],
      isPublished: true
    }).limit(20);

    res.json({ posts: posts.map(toClientPost) });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch neutral posts', error: error.message });
  }
});

module.exports = router;
