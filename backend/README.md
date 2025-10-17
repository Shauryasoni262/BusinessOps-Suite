# BusinessOps Suite Backend API

A Node.js + Express.js backend API for the BusinessOps Suite application.

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Start the production server:
```bash
npm start
```

## 📡 API Endpoints

### Base URL
```
http://localhost:5000
```

### Available Routes

#### Health Check
- `GET /api/health` - Server health status

#### Authentication
- `GET /api/auth/test` - Test auth routes
- `POST /api/auth/login` - User login (placeholder)
- `POST /api/auth/register` - User registration (placeholder)

#### Dashboard
- `GET /api/dashboard/test` - Test dashboard routes
- `GET /api/dashboard/analytics` - Analytics data (placeholder)
- `GET /api/dashboard/projects` - Projects data (placeholder)

## 🏗️ Project Structure

```
backend/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── .env                  # Environment variables
├── routes/               # API route definitions
│   ├── auth.js          # Authentication routes
│   └── dashboard.js     # Dashboard routes
├── controllers/          # Route controllers (coming soon)
├── middleware/           # Custom middleware (coming soon)
├── models/              # Data models (coming soon)
└── utils/               # Utility functions (coming soon)
```

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 📦 Dependencies

### Production
- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable loader

### Development
- `nodemon` - Auto-restart server during development

## 🚧 Next Steps

1. **Database Integration** - Add PostgreSQL or MongoDB
2. **Authentication** - Implement JWT-based auth
3. **Data Models** - Create user, project, analytics models
4. **Validation** - Add input validation middleware
5. **Error Handling** - Implement proper error handling
6. **Testing** - Add unit and integration tests

## 🤝 Contributing

This is a learning project. Feel free to experiment and add new features!
