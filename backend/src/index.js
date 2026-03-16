const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const seed = require('./seed');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : true,
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Rate limiting - DISABLED for development
/*
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
*/

// Routes
app.use('/api/auth', require('./modules/auth/routes'));
app.use('/api/subjects', require('./modules/subjects/routes'));
app.use('/api/videos', require('./modules/videos/routes'));
app.use('/api/progress', require('./modules/progress/routes'));
app.use('/api/enrollments', require('./modules/enrollments/routes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await seed();
  console.log(`Server running on port ${PORT}`);
});