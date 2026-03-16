const db = require('./config/database')
const bcrypt = require('bcryptjs')

async function seed() {
  try {
    // Tables
    await db.runAsync(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`)
    await db.runAsync(`CREATE TABLE IF NOT EXISTS subjects (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, description TEXT, price_usd DECIMAL(10,2) DEFAULT 0, is_free BOOLEAN DEFAULT 0, is_published BOOLEAN DEFAULT 0, instructor_name TEXT, duration_hours INTEGER, level TEXT DEFAULT 'Beginner', category TEXT, thumbnail_url TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`)
    await db.runAsync(`CREATE TABLE IF NOT EXISTS sections (id INTEGER PRIMARY KEY AUTOINCREMENT, subject_id INTEGER NOT NULL, title TEXT NOT NULL, order_index INTEGER NOT NULL, FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE)`)
    await db.runAsync(`CREATE TABLE IF NOT EXISTS videos (id INTEGER PRIMARY KEY AUTOINCREMENT, section_id INTEGER NOT NULL, title TEXT NOT NULL, description TEXT, youtube_url TEXT NOT NULL, order_index INTEGER NOT NULL, duration_seconds INTEGER, FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE)`)
    await db.runAsync(`CREATE TABLE IF NOT EXISTS enrollments (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, subject_id INTEGER NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (subject_id) REFERENCES subjects(id), UNIQUE(user_id, subject_id))`)
    await db.runAsync(`CREATE TABLE IF NOT EXISTS video_progress (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, video_id INTEGER NOT NULL, last_position_seconds INTEGER DEFAULT 0, is_completed BOOLEAN DEFAULT 0, completed_at DATETIME NULL, FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (video_id) REFERENCES videos(id), UNIQUE(user_id, video_id))`)
    await db.runAsync(`CREATE TABLE IF NOT EXISTS refresh_tokens (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, token_hash TEXT NOT NULL, expires_at DATETIME NOT NULL, revoked_at DATETIME NULL, FOREIGN KEY (user_id) REFERENCES users(id))`)
    await db.runAsync(`CREATE TABLE IF NOT EXISTS subscriptions (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, subject_id INTEGER NOT NULL, status TEXT DEFAULT 'active', payment_amount DECIMAL(10,2), payment_method TEXT, subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP, expires_at DATETIME NULL, FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (subject_id) REFERENCES subjects(id))`)

    // Check if already seeded
    const existing = await db.getAsync('SELECT id FROM subjects LIMIT 1')
    if (existing) { console.log('DB already seeded'); return }

    console.log('Seeding database...')

    // Demo user
    const hash = await bcrypt.hash('password123', 10)
    await db.runAsync(`INSERT OR IGNORE INTO users (name, email, password_hash) VALUES ('Demo User', 'demo@example.com', ?)`, [hash])

    // Subjects
    const subjects = [
      ['Java Programming', 'java-programming', 'Learn Java from basics to advanced OOP concepts', 99.99, 0, 'Dr. Sarah Johnson', 40, 'Intermediate', 'Programming', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'],
      ['Python for Beginners', 'python-beginners', 'Start your Python journey from scratch', 0, 1, 'Community Team', 20, 'Beginner', 'Programming', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400'],
      ['Web Development Bootcamp', 'web-development', 'Full-stack web development with React, Node.js, and databases', 199.99, 0, 'Alex Rodriguez', 80, 'Intermediate', 'Web Development', 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400'],
      ['Python for Data Science', 'python-data-science', 'Master Python for data analysis, machine learning, and AI', 149.99, 0, 'Prof. Michael Chen', 60, 'Advanced', 'Data Science', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400'],
      ['Machine Learning Fundamentals', 'machine-learning', 'Learn ML algorithms, neural networks, and practical applications', 179.99, 0, 'Dr. Emily Davis', 70, 'Advanced', 'AI/ML', 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400'],
      ['React & Next.js Masterclass', 'react-nextjs', 'Build modern web applications with React and Next.js', 129.99, 0, 'Mark Thompson', 45, 'Intermediate', 'Web Development', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400'],
      ['DevOps & Cloud Computing', 'devops-cloud', 'Master Docker, Kubernetes, AWS, and CI/CD pipelines', 159.99, 0, 'Lisa Wang', 55, 'Advanced', 'DevOps', 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400'],
      ['Mobile App Development', 'mobile-app-dev', 'Create iOS and Android apps with React Native', 139.99, 0, 'Carlos Martinez', 50, 'Intermediate', 'Mobile Development', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400'],
      ['Cybersecurity Essentials', 'cybersecurity', 'Learn ethical hacking, network security, and cyber defense', 119.99, 0, 'Rachel Green', 35, 'Beginner', 'Security', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400'],
      ['Blockchain & Web3', 'blockchain-web3', 'Understanding blockchain, smart contracts, and decentralized apps', 189.99, 0, 'David Kim', 65, 'Advanced', 'Blockchain', 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400'],
      ['UI/UX Design Principles', 'ui-ux-design', 'Master user interface and experience design for digital products', 89.99, 0, 'Anna Schmidt', 30, 'Beginner', 'Design', 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400'],
      ['Free Python Basics', 'python-basics-free', 'Introduction to Python programming - completely free!', 0, 1, 'Community Team', 10, 'Beginner', 'Programming', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400'],
    ]
    for (const s of subjects) {
      await db.runAsync(`INSERT OR IGNORE INTO subjects (title,slug,description,price_usd,is_free,is_published,instructor_name,duration_hours,level,category,thumbnail_url) VALUES (?,?,?,?,?,1,?,?,?,?,?)`, s)
    }

    // Sections & Videos per subject
    const courseData = [
      { slug: 'java-programming', sections: [
        { title: 'Java Basics', videos: [
          ['Variables and Data Types', 'Learn Java variables', 'https://www.youtube.com/watch?v=8X92KVm6fAA', 600],
          ['Control Structures', 'If/else and loops', 'https://www.youtube.com/watch?v=VqCPI5A4Omg', 720],
        ]},
        { title: 'Object Oriented Programming', videos: [
          ['Classes and Objects', 'Core OOP concepts', 'https://www.youtube.com/watch?v=PZJ8jF0M98w', 900],
          ['Inheritance', 'Extending classes', 'https://www.youtube.com/watch?v=lwBzH8ypxTY', 850],
          ['Polymorphism', 'Method overriding', 'https://www.youtube.com/watch?v=qCzZ7sHhIws', 780],
        ]},
      ]},
      { slug: 'python-beginners', sections: [
        { title: 'Getting Started', videos: [
          ['Variables', 'Python variables basics', 'https://www.youtube.com/watch?v=vmEHCJofslg', 500],
          ['Lists and Tuples', 'Python collections', 'https://www.youtube.com/watch?v=HdLIMoAeXTU', 600],
        ]},
        { title: 'Control Flow', videos: [
          ['Dictionaries', 'Key-value pairs', 'https://www.youtube.com/watch?v=daefaLgNkw0', 550],
        ]},
      ]},
      { slug: 'web-development', sections: [
        { title: 'HTML & CSS', videos: [
          ['HTML5 Fundamentals', 'HTML basics', 'https://www.youtube.com/watch?v=kUMe1FH4CHE', 800],
          ['CSS Styling', 'Styling web pages', 'https://www.youtube.com/watch?v=1Rs2ND1ryYc', 750],
        ]},
        { title: 'JavaScript', videos: [
          ['JavaScript Basics', 'JS fundamentals', 'https://www.youtube.com/watch?v=W6NZfCO5SIk', 900],
        ]},
      ]},
      { slug: 'python-data-science', sections: [
        { title: 'Python for Data Science', videos: [
          ['Python for Data Science Intro', 'Why Python?', 'https://www.youtube.com/watch?v=rfscVS0vtbw', 450],
          ['NumPy Basics', 'Arrays and matrices', 'https://www.youtube.com/watch?v=QUT1VHiLmmI', 600],
        ]},
        { title: 'Pandas & ML', videos: [
          ['Pandas Tutorial', 'Data analysis', 'https://www.youtube.com/watch?v=vmEHCJofslg', 700],
          ['ML with Scikit-learn', 'Machine learning basics', 'https://www.youtube.com/watch?v=7eh4XqeTea0', 800],
        ]},
      ]},
      { slug: 'machine-learning', sections: [
        { title: 'Introduction to ML', videos: [
          ['What is Machine Learning?', 'ML overview', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 600],
        ]},
        { title: 'Neural Networks', videos: [
          ['Neural Networks Intro', 'How neural nets work', 'https://www.youtube.com/watch?v=aircAruvnKk', 900],
          ['Deep Learning Basics', 'Deep learning intro', 'https://www.youtube.com/watch?v=VyWAvY2CF9c', 850],
        ]},
      ]},
      { slug: 'react-nextjs', sections: [
        { title: 'React Fundamentals', videos: [
          ['React Components', 'Building components', 'https://www.youtube.com/watch?v=Ke90Tje7VS0', 700],
        ]},
        { title: 'Next.js', videos: [
          ['Next.js Setup', 'Getting started with Next.js', 'https://www.youtube.com/watch?v=BZ6QtKJBxgM', 650],
          ['Advanced React Patterns', 'Hooks and context', 'https://www.youtube.com/watch?v=a_3MqfpJIao', 800],
        ]},
      ]},
      { slug: 'devops-cloud', sections: [
        { title: 'Docker', videos: [
          ['Docker Tutorial', 'Containers basics', 'https://www.youtube.com/watch?v=fqMOX6JJhGo', 900],
        ]},
        { title: 'Kubernetes & CI/CD', videos: [
          ['Kubernetes Basics', 'Container orchestration', 'https://www.youtube.com/watch?v=X482DVpZnBQ', 850],
          ['CI/CD Pipeline', 'Automated deployments', 'https://www.youtube.com/watch?v=SCiLIsNyE0o', 750],
        ]},
      ]},
      { slug: 'mobile-app-dev', sections: [
        { title: 'React Native', videos: [
          ['React Native Setup', 'Environment setup', 'https://www.youtube.com/watch?v=0-S5a0eXPoc', 600],
          ['Building Your First App', 'First mobile app', 'https://www.youtube.com/watch?v=dIhNNH5VFwo', 800],
        ]},
      ]},
      { slug: 'cybersecurity', sections: [
        { title: 'Security Fundamentals', videos: [
          ['Cybersecurity Basics', 'Security overview', 'https://www.youtube.com/watch?v=Mp7Cy6tlPAo', 700],
          ['Network Security', 'Securing networks', 'https://www.youtube.com/watch?v=3QF0eFb7PVI', 750],
        ]},
        { title: 'Ethical Hacking', videos: [
          ['Ethical Hacking', 'Penetration testing', 'https://www.youtube.com/watch?v=MnTvsthO4ks', 900],
        ]},
      ]},
      { slug: 'blockchain-web3', sections: [
        { title: 'Blockchain Basics', videos: [
          ['Blockchain Fundamentals', 'How blockchain works', 'https://www.youtube.com/watch?v=yubzJ60jE8A', 800],
        ]},
      ]},
      { slug: 'ui-ux-design', sections: [
        { title: 'Design Principles', videos: [
          ['Design Fundamentals', 'Core design concepts', 'https://www.youtube.com/watch?v=Ujh2RCFWvDo', 600],
          ['User Research Methods', 'Understanding users', 'https://www.youtube.com/watch?v=sz9mPjXG8rc', 700],
        ]},
        { title: 'Prototyping', videos: [
          ['Prototyping in Figma', 'Building prototypes', 'https://www.youtube.com/watch?v=Cx2fdp3rsmk', 750],
        ]},
      ]},
      { slug: 'python-basics-free', sections: [
        { title: 'Getting Started', videos: [
          ['Python Installation', 'Setting up Python', 'https://www.youtube.com/watch?v=kqtD5dpn9C8', 400],
          ['Your First Program', 'Hello World', 'https://www.youtube.com/watch?v=ZDa-Z5JzLYM', 350],
        ]},
        { title: 'Basic Concepts', videos: [
          ['Variables and Types', 'Python data types', 'https://www.youtube.com/watch?v=HdLIMoAeXTU', 500],
          ['Control Flow', 'Loops and conditions', 'https://www.youtube.com/watch?v=DQth9vR5s_s', 550],
        ]},
      ]},
    ]

    for (const course of courseData) {
      const subject = await db.getAsync('SELECT id FROM subjects WHERE slug = ?', [course.slug])
      if (!subject) continue
      for (let si = 0; si < course.sections.length; si++) {
        const sec = course.sections[si]
        await db.runAsync('INSERT OR IGNORE INTO sections (subject_id, title, order_index) VALUES (?,?,?)', [subject.id, sec.title, si])
        const section = await db.getAsync('SELECT id FROM sections WHERE subject_id = ? AND order_index = ?', [subject.id, si])
        for (let vi = 0; vi < sec.videos.length; vi++) {
          const [title, desc, url, dur] = sec.videos[vi]
          await db.runAsync('INSERT OR IGNORE INTO videos (section_id, title, description, youtube_url, order_index, duration_seconds) VALUES (?,?,?,?,?,?)', [section.id, title, desc, url, vi, dur])
        }
      }
    }

    console.log('Database seeded successfully!')
  } catch (err) {
    console.error('Seed error:', err)
  }
}

module.exports = seed
