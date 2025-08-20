# AI Council Backend

A Node.js/Express.js backend for the AI-powered university recommendation and counseling platform.

## Features

- **Authentication**: JWT-based user registration and login
- **Preferences Management**: Store and manage user academic preferences
- **AI Integration**: Google Gemini API integration for intelligent responses
- **University Recommendations**: AI-powered university suggestions
- **Chat Interface**: Conversational AI counseling
- **Secure API**: Input validation, authentication, and rate limiting

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcryptjs
- **AI Service**: Google Gemini API
- **Validation**: express-validator
- **Security**: helmet, CORS

## Project Structure

```
server/
├── src/
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Auth, validation, error handling
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API route definitions
│   └── services/          # External services (AI, etc.)
├── server.js              # Main server file
├── package.json
└── .env.example          # Environment variables template
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required environment variables:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `GEMINI_API_KEY`: Google Gemini API key
- `CLIENT_URL`: Frontend URL for CORS

### 3. Database Setup
Ensure MongoDB is running locally or provide a cloud MongoDB URI.

### 4. Start Development Server
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)
- `POST /api/auth/logout` - Logout (protected)

### Preferences
- `POST /api/preferences` - Create/update preferences (protected)
- `GET /api/preferences` - Get user preferences (protected)
- `GET /api/preferences/:id` - Get specific preferences (protected)
- `DELETE /api/preferences` - Delete preferences (protected)

### Chat
- `POST /api/chat/message` - Send message to AI (protected)
- `GET /api/chat/history` - Get chat history (protected)
- `DELETE /api/chat/history` - Clear chat history (protected)

### Recommendations
- `POST /api/recommendations/generate` - Generate recommendations (protected)
- `GET /api/recommendations` - Get user recommendations (protected)
- `GET /api/recommendations/:id` - Get specific recommendation (protected)
- `DELETE /api/recommendations/:id` - Delete recommendation (protected)
- `GET /api/recommendations/stats` - Get recommendation statistics (protected)

## Data Models

### User
- Name, email, password
- Authentication and profile management

### Preference
- Academic interests, preferred countries
- Budget range, test scores
- Study level, university size preference

### Recommendation
- Generated university suggestions
- AI response and metadata
- Status tracking

## Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcryptjs with salt rounds
- **Input Validation**: express-validator for all inputs
- **CORS Configuration**: Restricted to frontend domain
- **Rate Limiting**: Protection against abuse
- **Helmet**: Security headers

## AI Integration

The system integrates with Google Gemini API to provide:

1. **Conversational Responses**: Context-aware chat responses
2. **University Recommendations**: Structured university suggestions
3. **Retry Logic**: Robust error handling and retry mechanisms
4. **Response Parsing**: Intelligent parsing of AI responses

## Development

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (placeholder)

### Environment Variables
See `.env.example` for all available configuration options.

### Database Schema
All models include:
- Timestamps (createdAt, updatedAt)
- Validation rules
- Indexes for performance
- Proper relationships

## Production Deployment

1. Set `NODE_ENV=production`
2. Use secure JWT secrets
3. Configure production MongoDB
4. Set up proper CORS origins
5. Enable HTTPS
6. Configure rate limiting
7. Set up monitoring and logging

## Error Handling

The API provides consistent error responses:
```json
{
  "error": "Error type",
  "message": "User-friendly message",
  "details": "Additional error details (development only)"
}
```

## Contributing

1. Follow the existing code structure
2. Add proper validation for new endpoints
3. Include error handling
4. Update documentation
5. Test all changes

## License

MIT License
