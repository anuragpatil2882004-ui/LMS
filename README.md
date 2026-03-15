# Learning Management System (LMS)

A complete LMS built with Next.js 14, Node.js, Express, and MySQL.

## Features

- User authentication with JWT
- Course management with sections and videos
- Sequential video unlocking
- Progress tracking
- YouTube video integration
- Responsive UI with Tailwind CSS

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- React
- Tailwind CSS
- Zustand for state management
- Axios for API calls

### Backend
- Node.js
- Express.js
- MySQL
- JWT for authentication
- bcryptjs for password hashing

### Database
- MySQL

## Project Structure

```
lms/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── subjects/
│   │   │   ├── videos/
│   │   │   └── progress/
│   │   ├── utils/
│   │   └── index.js
│   ├── package.json
│   ├── schema.sql
│   └── .env
└── frontend/
    ├── app/
    ├── components/
    ├── store/
    ├── lib/
    ├── package.json
    ├── next.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

## Setup Instructions

### Database Setup

1. Create a MySQL database named `lms`
2. Run the SQL script in `backend/schema.sql` to create tables

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=lms
   JWT_ACCESS_SECRET=your_access_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Subjects
- `GET /api/subjects` - Get all published subjects
- `GET /api/subjects/:subjectId` - Get subject details
- `GET /api/subjects/:subjectId/tree` - Get subject tree with sections and videos
- `GET /api/subjects/:subjectId/first-video` - Get first video of subject

### Videos
- `GET /api/videos/:videoId` - Get video details

### Progress
- `GET /api/progress/subjects/:subjectId` - Get progress for subject
- `GET /api/progress/videos/:videoId` - Get progress for video
- `POST /api/progress/videos/:videoId` - Update progress for video

## Deployment

### Backend (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables

### Frontend (Vercel)
1. Create a new project on Vercel
2. Connect your GitHub repository
3. Add environment variables
4. Deploy

### Database (Aiven)
1. Create a MySQL database on Aiven
2. Update connection details in backend environment variables

## Database Schema

The database consists of the following tables:
- `users` - User accounts
- `subjects` - Courses
- `sections` - Course sections
- `videos` - Course videos
- `enrollments` - User course enrollments
- `video_progress` - User video progress
- `refresh_tokens` - JWT refresh tokens

## Learning Order Logic

Videos must be watched in sequence:
1. The first video is always unlocked
2. A video unlocks only after the previous video is completed
3. Previous video can be in the same section or the last video of the previous section

## YouTube Integration

- Videos are embedded using YouTube iframe API
- Progress is tracked every 5 seconds
- Videos resume from last watched position
- Completion is marked when video ends

## Security Features

- JWT authentication with access and refresh tokens
- HTTP-only cookies for refresh tokens
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS configuration