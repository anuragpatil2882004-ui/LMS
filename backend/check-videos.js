const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./lms.db', (err) => {
  if (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
  
  console.log('Checking videos in database...\n');
  
  db.all("SELECT id, title, youtube_url, section_id FROM videos LIMIT 5", [], (err, rows) => {
    if (err) {
      console.error('Error:', err.message);
    } else {
      console.log('Sample videos:');
      rows.forEach((row, idx) => {
        console.log(`\n${idx + 1}. ${row.title}`);
        console.log(`   ID: ${row.id}`);
        console.log(`   YouTube URL: ${row.youtube_url}`);
        console.log(`   Section ID: ${row.section_id}`);
      });
    }
    db.close();
  });
});
