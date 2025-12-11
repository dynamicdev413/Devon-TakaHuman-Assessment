# Notes Application - Backend

A RESTful API backend for a Notes application built with Node.js, Express, MongoDB, and JWT authentication.

## Features

- User authentication (signup/login) with JWT
- Secure password hashing using bcrypt
- CRUD operations for notes
- Request validation
- Error handling
- MongoDB database integration
- **Rate limiting** to protect against brute force attacks
- **Login attempt tracking** and **account lockout** mechanism
- **Security headers** via Helmet.js
- Request size limiting to prevent DoS attacks

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/notesapp
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

**Note:** Make sure MongoDB is running on your system. If using MongoDB Atlas, update `MONGODB_URI` with your connection string.

## Running the Server

### Development Mode
```bash
npm run dev
```

The server will start on `http://localhost:5000` (or the port specified in your `.env` file).

### Production Mode
```bash
npm start
```

## API Endpoints

### Authentication

#### POST /auth/signup
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com"
  }
}
```

#### POST /auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com"
  }
}
```

### Notes (Requires Authentication)

All note endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

#### POST /notes
Create a new note.

**Request Body:**
```json
{
  "title": "Note Title",
  "content": "Note content here"
}
```

#### GET /notes
Get all notes for the authenticated user.

**Response:**
```json
{
  "message": "Notes retrieved successfully",
  "notes": [
    {
      "_id": "note-id",
      "title": "Note Title",
      "content": "Note content",
      "user": "user-id",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### PUT /notes/:id
Update an existing note.

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content"
}
```

#### DELETE /notes/:id
Delete a note.

## Testing

Run the test suite:
```bash
npm test
```

The tests use a separate test database. Make sure MongoDB is running before executing tests.

## Project Structure

```
backend/
├── models/
│   ├── User.js          # User model
│   └── Note.js          # Note model
├── routes/
│   ├── auth.js          # Authentication routes
│   └── notes.js         # Notes routes
├── middleware/
│   ├── auth.js          # JWT authentication middleware
│   └── rateLimiter.js  # Rate limiting middleware
├── tests/
│   ├── auth.test.js     # Authentication tests
│   ├── notes.test.js    # Notes tests
│   └── security.test.js # Security features tests
├── server.js            # Express app setup
├── package.json
└── README.md
```

## Security Features

- **Password Security**: Passwords are hashed using bcrypt before storage
- **JWT Tokens**: Tokens expire after 7 days
- **Input Validation**: All endpoints have request validation
- **User Isolation**: Users can only access their own notes
- **Rate Limiting**: 
  - General API: 100 requests per 15 minutes per IP
  - Authentication endpoints: 5 requests per 15 minutes per IP
  - Login endpoint: 5 attempts per 15 minutes per IP
- **Login Attempt Tracking**: Failed login attempts are tracked per user
- **Account Lockout**: Accounts are automatically locked after 5 failed login attempts for 30 minutes
- **Security Headers**: Helmet.js provides various HTTP security headers
- **Request Size Limiting**: 10MB limit to prevent DoS attacks
- **CORS**: Configured for cross-origin requests

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `404` - Not Found
- `423` - Locked (Account locked due to too many failed login attempts)
- `429` - Too Many Requests (Rate limit exceeded)
- `500` - Internal Server Error

