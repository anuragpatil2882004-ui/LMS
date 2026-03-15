const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./lms.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

async function createTestUser() {
  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    // Insert test user
    db.run(
      'INSERT OR IGNORE INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      ['Test User', 'test@example.com', passwordHash],
      function(err) {
        if (err) {
          console.error('Error creating test user:', err.message);
        } else {
          console.log('Test user created successfully!');
          console.log('Email: test@example.com');
          console.log('Password: password123');
        }
        db.close();
      }
    );
  } catch (error) {
    console.error('Error:', error);
    db.close();
  }
}

createTestUser();