const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./lms.db');

db.exec(`
  INSERT OR REPLACE INTO videos (section_id, title, description, youtube_url, order_index, duration_seconds) 
  VALUES 
    (90, 'Blockchain Basics', 'Understanding blockchain technology', 'https://www.youtube.com/watch?v=SSo_EIwHSd4', 0, 600),
    (91, 'Smart Contracts Intro', 'Building smart contracts', 'https://www.youtube.com/watch?v=ipwxYa-F1uY', 0, 780)
`, (err) => {
  if(err) console.log(err);
  else {
    console.log('✅ Blockchain videos added!');
    db.all('SELECT COUNT(*) as count FROM videos WHERE section_id IN (90, 91)', [], (err, row) => {
      console.log(`Blockchain now has ${row.count} videos`);
      db.close();
    });
  }
});
