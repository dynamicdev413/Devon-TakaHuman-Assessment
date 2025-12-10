# Notes Application - Frontend

A modern React frontend for the Notes application built with Vite, React Router, and Axios.

## Features

- User authentication (signup/login)
- Create, read, update, and delete notes
- JWT token management
- Error and loading states
- Responsive design
- Modern UI with gradient backgrounds

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running (see backend README)

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, defaults to `http://localhost:5000`):
```env
VITE_API_URL=http://localhost:5000
```

## Running the Application

### Development Mode
```bash
npm run dev
```

The application will start on `http://localhost:3000` (or the next available port).

### Production Build
```bash
npm run build
npm run preview
```

## Features Overview

### Authentication
- **Signup**: Create a new account with email and password
- **Login**: Authenticate with existing credentials
- JWT tokens are stored in localStorage and automatically attached to API requests

### Notes Management
- **Create**: Add new notes with title and content
- **List**: View all your notes in a responsive grid layout
- **Edit**: Update existing notes inline
- **Delete**: Remove notes with confirmation

### User Experience
- Loading states during API calls
- Error messages for failed operations
- Success messages for completed actions
- Responsive design for mobile and desktop
- Smooth animations and transitions

## Testing

Run the test suite:
```bash
npm test
```

Run tests with UI:
```bash
npm run test:ui
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── PrivateRoute.jsx      # Protected route wrapper
│   │   └── __tests__/            # Component tests
│   ├── context/
│   │   └── AuthContext.jsx       # Authentication context
│   ├── pages/
│   │   ├── Login.jsx             # Login page
│   │   ├── Signup.jsx            # Signup page
│   │   ├── Notes.jsx             # Notes management page
│   │   └── __tests__/            # Page tests
│   ├── services/
│   │   └── api.js                # Axios API configuration
│   ├── test/
│   │   └── setup.js              # Test setup
│   ├── App.jsx                   # Main app component
│   ├── App.css                   # App styles
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## API Integration

The frontend communicates with the backend API at `http://localhost:5000` by default. All authenticated requests automatically include the JWT token in the Authorization header.

### API Endpoints Used
- `POST /auth/signup` - User registration
- `POST /auth/login` - User authentication
- `POST /notes` - Create note
- `GET /notes` - Get all notes
- `PUT /notes/:id` - Update note
- `DELETE /notes/:id` - Delete note

## Error Handling

The application handles various error scenarios:
- Network errors
- Authentication failures (auto-redirect to login)
- Validation errors from the backend
- Server errors

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Notes

- The app uses React Router for navigation
- Authentication state is managed via React Context
- Axios interceptors handle token attachment and error responses
- All forms include proper validation
- Loading states prevent duplicate submissions

