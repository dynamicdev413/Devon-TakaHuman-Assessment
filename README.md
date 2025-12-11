# Notes Application - Full Stack

A complete full-stack Notes application with user authentication and CRUD operations for notes.

## Project Overview

This project consists of:
- **Backend**: Node.js + Express + MongoDB REST API with JWT authentication
- **Frontend**: React + Vite application with modern UI

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/notesapp
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory (in a new terminal):
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create a `.env` file if you need to change the API URL:
```env
VITE_API_URL=http://localhost:5000
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Features

### Backend
-  REST API with Express
-  User authentication (signup/login)
-  JWT token-based authentication
-  Secure password hashing with bcrypt
-  MongoDB database integration
-  Request validation
-  Error handling
-  **Rate limiting** and **account lockout** mechanisms
-  **Security headers** and **DoS protection**
-  Unit tests

### Frontend
-  React application with Vite
-  Signup and login pages
-  Notes CRUD operations (Create, Read, Update, Delete)
-  JWT token storage and management
-  Error and loading states
-  Responsive design
-  Unit tests

## API Endpoints

### Authentication
- `POST /auth/signup` - Create new user account
- `POST /auth/login` - Login with credentials

### Notes (Requires Authentication)
- `POST /notes` - Create a new note
- `GET /notes` - Get all notes for authenticated user
- `PUT /notes/:id` - Update a note
- `DELETE /notes/:id` - Delete a note

All note endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Project Structure

```
.
├── backend/
│   ├── models/          # MongoDB models (User, Note)
│   ├── routes/          # API routes (auth, notes)
│   ├── middleware/      # Authentication middleware
│   ├── tests/           # Backend tests
│   ├── server.js        # Express app entry point
│   └── README.md        # Backend documentation
│
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # React Context (Auth)
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service
│   │   └── test/        # Test setup
│   ├── vite.config.js
│   └── README.md        # Frontend documentation
│
└── README.md            # This file
```

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Request validation
- **Jest** - Testing framework

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **Vitest** - Testing framework
- **React Testing Library** - Component testing

## Security Features

- **Password Security**: Passwords are hashed using bcrypt before storage
- **JWT Tokens**: Tokens expire after 7 days
- **Input Validation**: All endpoints have request validation
- **User Isolation**: Users can only access their own notes
- **Rate Limiting**: Multi-tier rate limiting (general API, auth endpoints, login)
- **Login Attempt Tracking**: Failed attempts are tracked per user
- **Account Lockout**: Automatic lockout after 5 failed attempts (30 min duration)
- **Security Headers**: Helmet.js provides HTTP security headers
- **Request Size Limiting**: 10MB limit to prevent DoS attacks
- **CORS**: Configured for cross-origin requests
- **Environment Variables**: Sensitive data stored in environment variables

## Development

### Backend Development
- Uses nodemon for auto-reload during development
- Separate test database configuration
- Comprehensive error handling

### Frontend Development
- Hot module replacement with Vite
- Proxy configuration for API calls
- Modern ES6+ syntax

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Use a production MongoDB instance
4. Run `npm start`

### Frontend
1. Build the application: `npm run build`
2. Serve the `dist` folder with a web server
3. Configure environment variables for production API URL

## License

This project is created for assessment purposes.

## Author

Created as part of a full-stack development assessment.

