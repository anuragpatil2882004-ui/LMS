const sqlite3 = require('sqlite3').verbose();

// Open database
const db = new sqlite3.Database('./lms.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database.');
  
  // Add all missing columns
  const alterQueries = [
    'ALTER TABLE subjects ADD COLUMN price_usd DECIMAL(10,2) NOT NULL DEFAULT 0.00',
    'ALTER TABLE subjects ADD COLUMN is_free BOOLEAN DEFAULT 0',
    'ALTER TABLE subjects ADD COLUMN is_published BOOLEAN DEFAULT 0',
    'ALTER TABLE subjects ADD COLUMN instructor_name TEXT',
    'ALTER TABLE subjects ADD COLUMN duration_hours INTEGER',
    'ALTER TABLE subjects ADD COLUMN level TEXT',
    'ALTER TABLE subjects ADD COLUMN category TEXT',
    'ALTER TABLE subjects ADD COLUMN thumbnail_url TEXT'
  ];
  
  let completed = 0;
  
  alterQueries.forEach((query, index) => {
    db.exec(query, (err) => {
      if (err && !err.message.includes('duplicate column')) {
        console.error(`Error executing query ${index + 1}:`, err.message);
      } else {
        console.log(`Column ${index + 1} processed successfully`);
      }
      completed++;
      
      if (completed === alterQueries.length) {
        // All columns added, now insert sample data
        insertSampleData();
      }
    });
  });
});

function insertSampleData() {
  const sampleData = `
  INSERT OR IGNORE INTO subjects (title, slug, description, price_usd, is_free, is_published, instructor_name, duration_hours, level, category, thumbnail_url) VALUES
  ('Java Programming Mastery', 'java-programming', 'Complete Java programming course from basics to advanced concepts', 99.99, 0, 1, 'Dr. Sarah Johnson', 40, 'Intermediate', 'Programming', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'),
  ('Python for Data Science', 'python-data-science', 'Master Python for data analysis, machine learning, and AI', 149.99, 0, 1, 'Prof. Michael Chen', 60, 'Advanced', 'Data Science', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400'),
  ('Web Development Bootcamp', 'web-development', 'Full-stack web development with React, Node.js, and databases', 199.99, 0, 1, 'Alex Rodriguez', 80, 'Intermediate', 'Web Development', 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400'),
  ('Machine Learning Fundamentals', 'machine-learning', 'Learn ML algorithms, neural networks, and practical applications', 179.99, 0, 1, 'Dr. Emily Davis', 70, 'Advanced', 'AI/ML', 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400'),
  ('React & Next.js Masterclass', 'react-nextjs', 'Build modern web applications with React and Next.js', 129.99, 0, 1, 'Mark Thompson', 45, 'Intermediate', 'Web Development', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400'),
  ('DevOps & Cloud Computing', 'devops-cloud', 'Master Docker, Kubernetes, AWS, and CI/CD pipelines', 159.99, 0, 1, 'Lisa Wang', 55, 'Advanced', 'DevOps', 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400'),
  ('Mobile App Development', 'mobile-app-dev', 'Create iOS and Android apps with React Native', 139.99, 0, 1, 'Carlos Martinez', 50, 'Intermediate', 'Mobile Development', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400'),
  ('Cybersecurity Essentials', 'cybersecurity', 'Learn ethical hacking, network security, and cyber defense', 119.99, 0, 1, 'Rachel Green', 35, 'Beginner', 'Security', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400'),
  ('Blockchain & Web3', 'blockchain-web3', 'Understanding blockchain, smart contracts, and decentralized apps', 189.99, 0, 1, 'David Kim', 65, 'Advanced', 'Blockchain', 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400'),
  ('UI/UX Design Principles', 'ui-ux-design', 'Master user interface and experience design for digital products', 89.99, 0, 1, 'Anna Schmidt', 30, 'Beginner', 'Design', 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400'),
  ('Free Python Basics', 'python-basics-free', 'Introduction to Python programming - completely free!', 0.00, 1, 1, 'Community Team', 10, 'Beginner', 'Programming', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400');

  -- Sample sections for Java
  INSERT OR IGNORE INTO sections (subject_id, title, order_index) VALUES
  (1, 'Java Fundamentals', 0),
  (1, 'Object Oriented Programming', 1),
  (1, 'Advanced Java Concepts', 2);

  -- Sample videos for Java Fundamentals
  INSERT OR IGNORE INTO videos (section_id, title, description, youtube_url, order_index, duration_seconds) VALUES
  (1, 'Introduction to Java', 'What is Java and why learn it?', 'https://www.youtube.com/watch?v=example1', 0, 600),
  (1, 'Setting up Development Environment', 'Install JDK and IDE', 'https://www.youtube.com/watch?v=example2', 1, 720),
  (1, 'Variables and Data Types', 'Understanding Java data types', 'https://www.youtube.com/watch?v=example3', 2, 800);

  -- Sample videos for Java OOP
  INSERT OR IGNORE INTO videos (section_id, title, description, youtube_url, order_index, duration_seconds) VALUES
  (2, 'Classes and Objects', 'Core OOP concepts', 'https://www.youtube.com/watch?v=example4', 0, 900),
  (2, 'Inheritance and Polymorphism', 'Advanced OOP principles', 'https://www.youtube.com/watch?v=example5', 1, 850);

  -- Sample sections for Python Data Science
  INSERT OR IGNORE INTO sections (subject_id, title, order_index) VALUES
  (2, 'Python Basics for Data Science', 0),
  (2, 'Data Analysis with Pandas', 1),
  (2, 'Machine Learning with Scikit-learn', 2);

  -- Sample videos for Python Data Science
  INSERT OR IGNORE INTO videos (section_id, title, description, youtube_url, order_index, duration_seconds) VALUES
  (3, 'Python for Data Science Intro', 'Why Python for data science?', 'https://www.youtube.com/watch?v=example6', 0, 450),
  (3, 'NumPy Fundamentals', 'Working with arrays and matrices', 'https://www.youtube.com/watch?v=example7', 1, 600);

  -- Sample sections for Free Python Basics
  INSERT OR IGNORE INTO sections (subject_id, title, order_index) VALUES
  (11, 'Getting Started with Python', 0),
  (11, 'Basic Programming Concepts', 1);

  -- Sample videos for Free Python
  INSERT OR IGNORE INTO videos (section_id, title, description, youtube_url, order_index, duration_seconds) VALUES
  (6, 'Hello World in Python', 'Your first Python program', 'https://www.youtube.com/watch?v=example8', 0, 300),
  (6, 'Variables and Data Types', 'Understanding Python variables', 'https://www.youtube.com/watch?v=example9', 1, 450),
  (7, 'Control Structures', 'If statements and loops', 'https://www.youtube.com/watch?v=example10', 0, 550);
  `;

  db.exec(sampleData, (err) => {
    if (err) {
      console.error('Error inserting sample data:', err.message);
    } else {
      console.log('✓ Sample data inserted successfully.');
    }
    db.close(() => {
      console.log('Database migration completed!');
    });
  });
}
