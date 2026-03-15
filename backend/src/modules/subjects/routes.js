const express = require('express');
const pool = require('../../config/database');
const { authenticateToken } = require('../../middleware/auth');

const router = express.Router();

// Get all subjects
router.get('/', async (req, res) => {
  try {
    const subjects = await pool.allAsync(
      `SELECT id, title, slug, description, price_usd, is_free, instructor_name, 
       duration_hours, level, category, thumbnail_url 
       FROM subjects WHERE is_published = 1 ORDER BY title`
    );
    res.json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get subject by ID
router.get('/:subjectId', async (req, res) => {
  try {
    const { subjectId } = req.params;
    const subject = await pool.getAsync(
      `SELECT id, title, slug, description, price_usd, is_free, instructor_name, 
       duration_hours, level, category, thumbnail_url 
       FROM subjects WHERE id = ? AND is_published = 1`,
      [subjectId]
    );

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    res.json(subject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get subject tree (sections and videos)
router.get('/:subjectId/tree', authenticateToken, async (req, res) => {
  try {
    const { subjectId } = req.params;
    const userId = req.userId;

    // Get sections with videos
    const sections = await pool.allAsync(`
      SELECT
        s.id, s.title, s.order_index,
        v.id as video_id, v.title as video_title, v.description as video_description,
        v.youtube_url, v.order_index as video_order, v.duration_seconds,
        vp.is_completed, vp.last_position_seconds
      FROM sections s
      LEFT JOIN videos v ON s.id = v.section_id
      LEFT JOIN video_progress vp ON v.id = vp.video_id AND vp.user_id = ?
      WHERE s.subject_id = ?
      ORDER BY s.order_index, v.order_index
    `, [userId, subjectId]);

    // Group by sections
    const tree = {};
    sections.forEach(row => {
      if (!tree[row.id]) {
        tree[row.id] = {
          id: row.id,
          title: row.title,
          order_index: row.order_index,
          videos: []
        };
      }
      if (row.video_id) {
        tree[row.id].videos.push({
          id: row.video_id,
          title: row.video_title,
          description: row.video_description,
          youtube_url: row.youtube_url,
          order_index: row.video_order,
          duration_seconds: row.duration_seconds,
          is_completed: row.is_completed || false,
          last_position_seconds: row.last_position_seconds || 0
        });
      }
    });

    res.json(Object.values(tree));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get first video of subject
router.get('/:subjectId/first-video', authenticateToken, async (req, res) => {
  try {
    const { subjectId } = req.params;
    const userId = req.userId;

    console.log(`Getting first video for subject ${subjectId} for user ${userId}`);

    // Get first video
    const video = await pool.getAsync(`
      SELECT v.id, v.title, v.description, v.youtube_url, v.duration_seconds
      FROM videos v
      JOIN sections s ON v.section_id = s.id
      WHERE s.subject_id = ?
      ORDER BY s.order_index, v.order_index
      LIMIT 1
    `, [subjectId]);

    console.log('First video found:', video ? video.id : 'NONE');

    if (!video) {
      return res.status(404).json({ error: 'No videos found in this course' });
    }

    res.json(video);
  } catch (error) {
    console.error('Error in first-video endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check subscription status for a subject
router.get('/:subjectId/subscription', authenticateToken, async (req, res) => {
  try {
    const { subjectId } = req.params;
    const userId = req.user.id;

    // Check if user has active subscription
    const subscription = await pool.getAsync(
      'SELECT * FROM subscriptions WHERE user_id = ? AND subject_id = ? AND status = "active"',
      [userId, subjectId]
    );

    // Check if course is free
    const subject = await pool.getAsync(
      'SELECT is_free FROM subjects WHERE id = ?',
      [subjectId]
    );

    const hasAccess = subscription || subject.is_free;

    res.json({
      hasAccess,
      subscription: subscription || null,
      isFree: subject.is_free
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Subscribe to a paid course (mock payment)
router.post('/:subjectId/subscribe', authenticateToken, async (req, res) => {
  try {
    const { subjectId } = req.params;
    const userId = req.user.id;

    // Check if subject exists and is not free
    const subject = await pool.getAsync(
      'SELECT id, title, price_usd, is_free FROM subjects WHERE id = ? AND is_published = 1',
      [subjectId]
    );

    if (!subject) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (subject.is_free) {
      return res.status(400).json({ error: 'This course is free' });
    }

    // Check if user already has subscription
    const existingSubscription = await pool.getAsync(
      'SELECT id FROM subscriptions WHERE user_id = ? AND subject_id = ? AND status = "active"',
      [userId, subjectId]
    );

    if (existingSubscription) {
      return res.status(400).json({ error: 'Already subscribed to this course' });
    }

    // Create subscription (mock payment - in real app, integrate with payment processor)
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 year subscription

    await pool.runAsync(
      'INSERT INTO subscriptions (user_id, subject_id, payment_amount, payment_method, expires_at) VALUES (?, ?, ?, ?, ?)',
      [userId, subjectId, subject.price_usd, 'mock_payment', expiresAt.toISOString()]
    );

    res.json({
      message: 'Successfully subscribed to course!',
      subscription: {
        subjectId,
        amount: subject.price_usd,
        expiresAt: expiresAt.toISOString()
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;