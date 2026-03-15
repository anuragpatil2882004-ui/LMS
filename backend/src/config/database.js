const sqlite3 = require('sqlite3').verbose();
const { promisify } = require('util');

// Create SQLite database
const db = new sqlite3.Database('./lms.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Promisify SQLite methods
db.runAsync = promisify(db.run.bind(db));
db.getAsync = promisify(db.get.bind(db));
db.allAsync = promisify(db.all.bind(db));

module.exports = db;