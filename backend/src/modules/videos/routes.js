const express = require('express');
const pool = require('../../config/database');
const { authenticateToken } = require('../../middleware/auth');

const router = express.Router();

// Get video by ID
router.get('/:videoId', authenticateToken, async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.userId;

    // Get video with progress
    const video = await pool.getAsync(`
      SELECT v.id, v.title, v.description, v.youtube_url, v.duration_seconds,
             vp.is_completed, vp.last_position_seconds
      FROM videos v
      LEFT JOIN video_progress vp ON v.id = vp.video_id AND vp.user_id = ?
      WHERE v.id = ?
    `, [userId, videoId]);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // TEMPORARILY DISABLED: Video unlocking logic
    // Allow all videos to play for better UX
    const isUnlocked = true;

    res.json({
      ...video,
      is_completed: video.is_completed || false,
      last_position_seconds: video.last_position_seconds || 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;