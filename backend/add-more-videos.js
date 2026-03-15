const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./lms.db', (err) => {
  if (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
  
  console.log('Adding more tutorial videos...\n');
  
  // Add more sample videos for all courses
  const newVideos = `
  -- More Java videos
  INSERT OR REPLACE INTO videos (id, section_id, title, description, youtube_url, order_index, duration_seconds) VALUES
  (10, 1, 'Java Data Types Explained', 'Complete guide to Java data types with examples', 'https://www.youtube.com/watch?v=AY9FJXZPZqs', 3, 720),
  (11, 2, 'Java Polymorphism', 'Understanding polymorphism in Java', 'https://www.youtube.com/watch?v=qCzZ7sHhIws', 2, 850),
  (12, 3, 'Java Advanced Topics', 'Advanced Java concepts for professionals', 'https://www.youtube.com/watch?v=WQxvTZAqLwU', 0, 900);
  
  -- More Python Data Science videos
  INSERT OR REPLACE INTO videos (id, section_id, title, description, youtube_url, order_index, duration_seconds) VALUES
  (13, 4, 'NumPy Arrays Tutorial', 'Master NumPy arrays for data science', 'https://www.youtube.com/watch?v=QUT1VHiLmmI', 2, 680),
  (14, 5, 'Data Visualization with Python', 'Create stunning visualizations', 'https://www.youtube.com/watch?v=3fXvWEGdVjM', 0, 750),
  (15, 6, 'Machine Learning Basics', 'Introduction to ML with scikit-learn', 'https://www.youtube.com/watch?v=7eh4XqeTea0', 0, 820);
  
  -- More Free Python videos
  INSERT OR REPLACE INTO videos (id, section_id, title, description, youtube_url, order_index, duration_seconds) VALUES
  (16, 7, 'Python Functions', 'Learn how to use functions in Python', 'https://www.youtube.com/watch?v=9OsnooIA2VE', 2, 540),
  (17, 8, 'Python Lists and Tuples', 'Working with Python data structures', 'https://www.youtube.com/watch?v=HdLIMoAeXTU', 0, 620),
  (18, 9, 'Python Dictionaries', 'Master Python dictionaries', 'https://www.youtube.com/watch?v=daefaLgNkw0', 1, 580);
  `;
  
  db.exec(newVideos, (err) => {
    if (err) {
      console.error('Error adding videos:', err.message);
    } else {
      console.log('✅ Added 9 more tutorial videos successfully!');
      
      // Verify total count
      db.get("SELECT COUNT(*) as count FROM videos", [], (err, row) => {
        if (err) {
          console.error('Error counting:', err.message);
        } else {
          console.log(`📊 Total videos in database: ${row.count}`);
        }
        db.close();
      });
    }
  });
});
