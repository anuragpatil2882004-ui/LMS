const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./lms.db', (err) => {
  if (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
  
  db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", [], (err, rows) => {
    if (err) {
      console.error('Error:', err.message);
    } else {
      console.log('Tables in database:');
      rows.forEach(row => console.log(`  - ${row.name}`));
    }
    db.close();
  });
});
