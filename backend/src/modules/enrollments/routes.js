const express = require('express');
const pool = require('../../config/database');
const { authenticateToken } = require('../../middleware/auth');

const router = express.Router();

// Get user's enrollments
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;
    
    const enrollments = await pool.allAsync(`
      SELECT e.id, e.subject_id, e.created_at, s.title as subject_title
      FROM enrollments e
      JOIN subjects s ON e.subject_id = s.id
      WHERE e.user_id = ?
      ORDER BY e.created_at DESC
    `, [userId]);
    
    res.json(enrollments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Enroll in a subject
router.post('/:subjectId', authenticateToken, async (req, res) => {
  try {
    const { subjectId } = req.params;
    const userId = req.userId;
    
    // Check if already enrolled
    const existing = await pool.getAsync(
      'SELECT id FROM enrollments WHERE user_id = ? AND subject_id = ?',
      [userId, subjectId]
    );
    
    if (existing) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }
    
    // Check if subject exists
    const subject = await pool.getAsync(
      'SELECT id, title, is_free FROM subjects WHERE id = ?',
      [subjectId]
    );
    
    if (!subject) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Enroll user
    await pool.runAsync(
      'INSERT INTO enrollments (user_id, subject_id) VALUES (?, ?)',
      [userId, subjectId]
    );
    
    res.json({
      message: `Successfully enrolled in ${subject.title}!`,
      enrollment: {
        subjectId,
        subjectTitle: subject.title,
        isFree: subject.is_free
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
