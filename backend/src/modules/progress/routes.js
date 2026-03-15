const express = require('express');
const pool = require('../../config/database');
const { authenticateToken } = require('../../middleware/auth');

const router = express.Router();

// Get progress for subject
router.get('/subjects/:subjectId', authenticateToken, async (req, res) => {
  try {
    const { subjectId } = req.params;
    const userId = req.userId;

    // Check enrollment
    const enrollment = await pool.getAsync(
      'SELECT id FROM enrollments WHERE user_id = ? AND subject_id = ?',
      [userId, subjectId]
    );

    if (!enrollment) {
      return res.status(403).json({ error: 'Not enrolled in this subject' });
    }

    // Get progress
    const progress = await pool.getAsync(`
      SELECT
        COUNT(*) as total_videos,
        SUM(CASE WHEN vp.is_completed = 1 THEN 1 ELSE 0 END) as completed_videos
      FROM videos v
      JOIN sections s ON v.section_id = s.id
      LEFT JOIN video_progress vp ON v.id = vp.video_id AND vp.user_id = ?
      WHERE s.subject_id = ?
    `, [userId, subjectId]);

    const { total_videos, completed_videos } = progress;
    const percentage = total_videos > 0 ? Math.round((completed_videos / total_videos) * 100) : 0;

    res.json({
      total_videos: parseInt(total_videos),
      completed_videos: parseInt(completed_videos),
      percentage
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get progress for video
router.get('/videos/:videoId', authenticateToken, async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.userId;

    const progress = await pool.getAsync(
      'SELECT last_position_seconds, is_completed FROM video_progress WHERE user_id = ? AND video_id = ?',
      [userId, videoId]
    );

    if (!progress) {
      return res.json({ last_position_seconds: 0, is_completed: false });
    }

    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update progress for video
router.post('/videos/:videoId', authenticateToken, async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.userId;
    const { last_position_seconds, is_completed } = req.body;

    // Check if video exists and user has access
    const video = await pool.getAsync('SELECT id FROM videos WHERE id = ?', [videoId]);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Use INSERT OR REPLACE to avoid unique constraint violations
    await pool.runAsync(
      `INSERT OR REPLACE INTO video_progress (user_id, video_id, last_position_seconds, is_completed, completed_at) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, videoId, last_position_seconds, is_completed, is_completed ? new Date().toISOString() : null]
    );

    res.json({ message: 'Progress updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;