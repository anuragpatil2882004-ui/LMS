const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./lms.db', (err) => {
  if (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
  
  console.log('Updating videos with real YouTube URLs...\n');
  
  // Real YouTube tutorial URLs
  const updates = [
    // Java Programming
    { id: 1, url: 'https://www.youtube.com/watch?v=8X92KVm6fAA' }, // Java Tutorial for Beginners
    { id: 2, url: 'https://www.youtube.com/watch?v=VqCPI5A4Omg' }, // Java Variables
    { id: 3, url: 'https://www.youtube.com/watch?v=PZJ8jF0M98w' }, // Java Classes and Objects
    { id: 4, url: 'https://www.youtube.com/watch?v=lwBzH8ypxTY' }, // Java Inheritance
    
    // Python Data Science
    { id: 5, url: 'https://www.youtube.com/watch?v=rfscVS0vtbw' }, // Python for Beginners
    { id: 6, url: 'https://www.youtube.com/watch?v=vmEHCJofslg' }, // Pandas Tutorial
    
    // Free Python Basics - Using real tutorials
    { id: 7, url: 'https://www.youtube.com/watch?v=kqtD5dpn9C8' }, // Python for Everybody
    { id: 8, url: 'https://www.youtube.com/watch?v=ZDa-Z5JzLYM' }, // Python Variables
    { id: 9, url: 'https://www.youtube.com/watch?v=DQth9vR5s_s' }, // Python Control Structures
  ];
  
  let completed = 0;
  
  updates.forEach((video) => {
    db.run(
      'UPDATE videos SET youtube_url = ? WHERE id = ?',
      [video.url, video.id],
      function(err) {
        if (err) {
          console.error(`Error updating video ${video.id}:`, err.message);
        } else {
          console.log(`✓ Updated video ${video.id}: ${video.url}`);
        }
        completed++;
        
        if (completed === updates.length) {
          console.log('\n✅ All videos updated with real YouTube URLs!');
          db.close();
        }
      }
    );
  });
});
