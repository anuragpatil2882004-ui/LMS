const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./lms.db', (err) => {
  if (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
  
  console.log('Adding sections and videos for all courses...\n');
  
  // Add sections for courses that don't have them
  const sections = `
  -- Python Data Science (subject 4)
  INSERT OR IGNORE INTO sections (id, subject_id, title, order_index) VALUES
  (20, 4, 'Python Basics for Data Science', 0),
  (21, 4, 'Data Analysis with Pandas', 1),
  (22, 4, 'Machine Learning with Scikit-learn', 2);
  
  -- Web Development (subject 5)
  INSERT OR IGNORE INTO sections (id, subject_id, title, order_index) VALUES
  (30, 5, 'HTML & CSS Fundamentals', 0),
  (31, 5, 'JavaScript Essentials', 1),
  (32, 5, 'React.js Deep Dive', 2);
  
  -- Machine Learning (subject 6)
  INSERT OR IGNORE INTO sections (id, subject_id, title, order_index) VALUES
  (40, 6, 'Introduction to ML', 0),
  (41, 6, 'Neural Networks', 1),
  (42, 6, 'Deep Learning', 2);
  
  -- React & Next.js (subject 7)
  INSERT OR IGNORE INTO sections (id, subject_id, title, order_index) VALUES
  (50, 7, 'React Fundamentals', 0),
  (51, 7, 'Next.js Basics', 1),
  (52, 7, 'Advanced Patterns', 2);
  
  -- DevOps (subject 8)
  INSERT OR IGNORE INTO sections (id, subject_id, title, order_index) VALUES
  (60, 8, 'Docker Essentials', 0),
  (61, 8, 'Kubernetes Basics', 1),
  (62, 8, 'CI/CD Pipelines', 2);
  
  -- Mobile App Dev (subject 9)
  INSERT OR IGNORE INTO sections (id, subject_id, title, order_index) VALUES
  (70, 9, 'React Native Setup', 0),
  (71, 9, 'Building Mobile UIs', 1),
  (72, 9, 'Native Features', 2);
  
  -- Cybersecurity (subject 10)
  INSERT OR IGNORE INTO sections (id, subject_id, title, order_index) VALUES
  (80, 10, 'Security Fundamentals', 0),
  (81, 10, 'Network Security', 1),
  (82, 10, 'Ethical Hacking', 2);
  
  -- Blockchain (subject 11)
  INSERT OR IGNORE INTO sections (id, subject_id, title, order_index) VALUES
  (90, 11, 'Blockchain Basics', 0),
  (91, 11, 'Smart Contracts', 1);
  
  -- UI/UX Design (subject 12)
  INSERT OR IGNORE INTO sections (id, subject_id, title, order_index) VALUES
  (100, 12, 'Design Principles', 0),
  (101, 12, 'User Research', 1),
  (102, 12, 'Prototyping', 2);
  
  -- Free Python Basics (subject 13)
  INSERT OR IGNORE INTO sections (id, subject_id, title, order_index) VALUES
  (110, 13, 'Getting Started', 0),
  (111, 13, 'Basic Concepts', 1),
  (112, 13, 'Practice Projects', 2);
  `;
  
  db.exec(sections, (err) => {
    if (err) {
      console.error('Error adding sections:', err.message);
    } else {
      console.log('✅ Sections added successfully');
      
      // Now add videos for each section
      const videos = `
      -- Videos for Python Data Science
      INSERT OR REPLACE INTO videos (section_id, title, description, youtube_url, order_index, duration_seconds) VALUES
      (20, 'Python for Data Science Intro', 'Why Python for data science?', 'https://www.youtube.com/watch?v=rfscVS0vtbw', 0, 450),
      (20, 'NumPy Basics', 'Working with arrays', 'https://www.youtube.com/watch?v=QUT1VHiLmmI', 1, 600),
      (21, 'Pandas Tutorial', 'Data manipulation with Pandas', 'https://www.youtube.com/watch?v=vmEHCJofslg', 0, 720),
      (22, 'ML with Scikit-learn', 'Introduction to machine learning', 'https://www.youtube.com/watch?v=7eh4XqeTea0', 0, 820);
      
      -- Videos for Web Development
      INSERT OR REPLACE INTO videos (section_id, title, description, youtube_url, order_index, duration_seconds) VALUES
      (30, 'HTML5 Fundamentals', 'Learn HTML from scratch', 'https://www.youtube.com/watch?v=kUMe1FH4CHE', 0, 900),
      (30, 'CSS Styling', 'Master CSS styling', 'https://www.youtube.com/watch?v=1Rs2ND1ryYc', 1, 850),
      (31, 'JavaScript Basics', 'JS fundamentals explained', 'https://www.youtube.com/watch?v=W6NZfCO5SIk', 0, 780),
      (32, 'React Introduction', 'Getting started with React', 'https://www.youtube.com/watch?v/Tn6-PIqc4UM', 0, 920);
      
      -- Videos for Machine Learning
      INSERT OR REPLACE INTO videos (section_id, title, description, youtube_url, order_index, duration_seconds) VALUES
      (40, 'What is Machine Learning?', 'ML basics explained', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 0, 600),
      (41, 'Neural Networks Intro', 'Understanding neural networks', 'https://www.youtube.com/watch?v=aircAruvnKk', 0, 1140),
      (42, 'Deep Learning Basics', 'Introduction to deep learning', 'https://www.youtube.com/watch?v=VyWAvY2CF9c', 0, 980);
      
      -- Videos for React & Next.js
      INSERT OR REPLACE INTO videos (section_id, title, description, youtube_url, order_index, duration_seconds) VALUES
      (50, 'React Components', 'Building your first components', 'https://www.youtube.com/watch?v=Ke90Tje7VS0', 0, 840),
      (51, 'Next.js Setup', 'Getting started with Next.js', 'https://www.youtube.com/watch?v=BZ6QtKJBxgM', 0, 720),
      (52, 'Advanced React Patterns', 'Level up your React skills', 'https://www.youtube.com/watch?v=a_3MqfpJIao', 0, 900);
      
      -- Videos for DevOps
      INSERT OR REPLACE INTO videos (section_id, title, description, youtube_url, order_index, duration_seconds) VALUES
      (60, 'Docker Tutorial', 'Containerization with Docker', 'https://www.youtube.com/watch?v=fqMOX6JJhGo', 0, 780),
      (61, 'Kubernetes Basics', 'Orchestration with Kubernetes', 'https://www.youtube.com/watch?v=X482DVpZnBQ', 0, 840),
      (62, 'CI/CD Pipeline', 'Automating deployments', 'https://www.youtube.com/watch?v=SCiLIsNyE0o', 0, 720);
      
      -- Videos for Mobile App Development
      INSERT OR REPLACE INTO videos (section_id, title, description, youtube_url, order_index, duration_seconds) VALUES
      (70, 'React Native Setup', 'Setting up your environment', 'https://www.youtube.com/watch?v=0-S5a0eXPoc', 0, 660),
      (71, 'Building Your First App', 'Create a mobile app', 'https://www.youtube.com/watch?v=dIhNNH5VFwo', 0, 900),
      (72, 'Using Native APIs', 'Access device features', 'https://www.youtube.com/watch?v=ZBCUegTZF7M', 0, 780);
      
      -- Videos for Cybersecurity
      INSERT OR REPLACE INTO videos (section_id, title, description, youtube_url, order_index, duration_seconds) VALUES
      (80, 'Cybersecurity Basics', 'Introduction to security', 'https://www.youtube.com/watch?v=Mp7Cy6tlPAo', 0, 720),
      (81, 'Network Security', 'Protecting networks', 'https://www.youtube.com/watch?v=3QF0eFb7PVI', 0, 840),
      (82, 'Ethical Hacking', 'Penetration testing basics', 'https://www.youtube.com/watch?v=MnTvsthO4ks', 0, 900);
      
      -- Videos for Blockchain
      INSERT OR REPLACE INTO videos (section_id, title, description, youtube_url, order_index, duration_seconds) VALUES
      (90, 'Blockchain Explained', 'Understanding blockchain', 'https://www.youtube.com/watch?v=SSo_EIwHSd4', 0, 600),
      (91, 'Smart Contracts', 'Building on Ethereum', 'https://www.youtube.com/watch?v=ipwxYa-F1uY', 0, 780);
      
      -- Videos for UI/UX Design
      INSERT OR REPLACE INTO videos (section_id, title, description, youtube_url, order_index, duration_seconds) VALUES
      (100, 'Design Fundamentals', 'Principles of good design', 'https://www.youtube.com/watch?v=Ujh2RCFWvDo', 0, 660),
      (101, 'User Research Methods', 'Understanding users', 'https://www.youtube.com/watch?v=sz9mPjXG8rc', 0, 720),
      (102, 'Prototyping in Figma', 'Creating prototypes', 'https://www.youtube.com/watch?v=Cx2fdp3rsmk', 0, 840);
      
      -- Videos for Free Python Basics
      INSERT OR REPLACE INTO videos (section_id, title, description, youtube_url, order_index, duration_seconds) VALUES
      (110, 'Python Installation', 'Get Python running', 'https://www.youtube.com/watch?v=kqtD5dpn9C8', 0, 420),
      (110, 'Your First Program', 'Hello World in Python', 'https://www.youtube.com/watch?v=ZDa-Z5JzLYM', 1, 360),
      (111, 'Variables and Types', 'Python data types', 'https://www.youtube.com/watch?v=HdLIMoAeXTU', 0, 540),
      (111, 'Control Flow', 'If statements and loops', 'https://www.youtube.com/watch?v=DQth9vR5s_s', 1, 600),
      (112, 'Mini Project', 'Build a simple game', 'https://www.youtube.com/watch?v=DLK4oXMNa8o', 0, 720);
      `;
      
      db.exec(videos, (err) => {
        if (err) {
          console.error('Error adding videos:', err.message);
        } else {
          console.log('✅ Videos added successfully');
          
          // Verify
          db.all('SELECT s.id, s.title, COUNT(DISTINCT sec.id) as sections, COUNT(DISTINCT v.id) as videos FROM subjects s LEFT JOIN sections sec ON s.id = sec.subject_id LEFT JOIN videos v ON sec.id = v.section_id WHERE s.is_published = 1 GROUP BY s.id ORDER BY s.id', [], (err, rows) => {
            if (err) {
              console.error('Error:', err.message);
            } else {
              console.log('\n📊 Course Summary:');
              console.log('=' .repeat(50));
              rows.forEach(row => {
                console.log(`${row.id}. ${row.title}`);
                console.log(`   Sections: ${row.sections} | Videos: ${row.videos}`);
              });
              
              const totalVideos = rows.reduce((sum, row) => sum + row.videos, 0);
              console.log('=' .repeat(50));
              console.log(`Total Videos: ${totalVideos}`);
            }
            db.close();
          });
        }
      });
    }
  });
});
