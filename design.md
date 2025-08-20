# **Low Level Design (LLD) – NextStep AI**

## **1. Introduction**

The AI Council system is a comprehensive university recommendation platform that integrates Google's **Gemini API** with a modern React frontend and Node.js/Express.js backend to provide:

- **Authentication System**: Secure user registration and login with JWT tokens
- **Preference Management**: Detailed academic and personal preference collection
- **AI-Powered Chat**: Interactive conversations with AI for university guidance
- **Smart Recommendations**: Personalized university recommendations based on user preferences
- **Dashboard Interface**: Centralized hub with integrated chat and recommendation sidebar

The backend acts as a **secure proxy** between the frontend and Gemini API, while MongoDB ensures persistence of user data, preferences, and recommendations.vel Design (LLD) – NextStep AI**

## **1. Introduction**

The system integrates Google’s **Gemini API** with a Node.js/Express.js backend to provide:

- **Chatbot Conversations**: AI-driven responses to student queries.
- **University Recommendations**: Personalized recommendations based on preferences.
    
    The backend acts as a **secure proxy** between the frontend and Gemini API, while MongoDB ensures persistence of preferences and recommendations.
    

---

## **2. Architecture Overview**

### **2.1 Project Structure**

```
AI-Council/
├── client/                    # React Frontend (Vite)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ChatInterface.jsx      # Shared chat component
│   │   │   ├── Common.jsx             # Common UI elements
│   │   │   ├── ProtectedRoute.jsx     # Route protection
│   │   │   └── Sidebar.jsx            # Navigation sidebar
│   │   ├── pages/            # Application pages
│   │   │   ├── Home.jsx              # Landing page
│   │   │   ├── Login.jsx             # User login
│   │   │   ├── Signup.jsx            # User registration
│   │   │   ├── Preferences.jsx       # Preference form
│   │   │   ├── Dashboard.jsx         # Main dashboard
│   │   │   ├── Recommendation.jsx    # Full recommendations view
│   │   │   └── Profile.jsx           # User profile
│   │   ├── context/          # React context providers
│   │   ├── services/         # API service functions
│   │   └── utils/            # Utility functions
│   ├── public/               # Static assets
│   └── package.json          # Dependencies & scripts
└── server/                   # Node.js Backend
    ├── src/
    │   ├── controllers/      # Request handlers
    │   │   ├── authController.js
    │   │   ├── chatController.js
    │   │   ├── preferencesController.js
    │   │   └── recommendationsController.js
    │   ├── models/           # MongoDB schemas
    │   ├── routes/           # API route definitions
    │   ├── services/         # Business logic
    │   │   └── aiService.js  # Gemini API integration
    │   └── middleware/       # Custom middleware
    ├── server.js             # Entry point
    └── package.json          # Dependencies & scripts
```

### **2.2 Technology Stack**

- **Frontend**: React 19 + Vite, Tailwind CSS, React Router DOM
- **Backend**: Node.js + Express.js, JWT Authentication
- **Database**: MongoDB with Mongoose ODM
- **AI Integration**: Google Gemini API
- **Development**: ESLint, Git version control

## **3. Backend Components**

### **3.1 AI Service**

- **File**: `server/src/services/aiService.js`
- **Responsibilities**:
    - Format user preferences and messages into Gemini prompts
    - Send requests to Gemini API (HTTPS, POST)
    - Parse and return conversational or structured responses
    - Handle errors (rate limits, invalid responses) with retry logic
    - Support both chat messages and recommendation generation
- **Security**:
    - API key stored in `.env`
    - Input sanitized with `express-validator`
    - HTTPS enforced for external API calls

### **3.2 Controllers**

### **3.2.1 Authentication Controller**
- **File**: `server/src/controllers/authController.js`
- **Routes**: 
    - `POST /api/auth/register` - User registration
    - `POST /api/auth/login` - User login
    - `GET /api/auth/verify` - Token verification

### **3.2.2 Chat Controller**
- **File**: `server/src/controllers/chatController.js`
- **Route**: `POST /api/chat/message` (Protected)
- **Input**:
    ```json
    {
      "message": "Find universities in Europe for engineering",
      "userId": "ObjectId"
    }
    ```
- **Process**:
    - Fetch user preferences from MongoDB
    - Construct prompt with preferences + message
    - Send to Gemini API via AI Service
    - Return conversational response
- **Output**:
    ```json
    {
      "response": "Here are some universities in Europe for engineering..."
    }
    ```

### **3.2.3 Recommendations Controller**
- **File**: `server/src/controllers/recommendationsController.js`
- **Routes**:
    - `POST /api/recommendations/generate` (Protected)
    - `GET /api/recommendations/:userId` (Protected)
- **Generate Process**:
    - Delete old recommendations for the user
    - Fetch user preferences
    - Construct structured prompt for Gemini
    - Parse AI response into structured university data
    - Save to `Recommendation` collection
- **Output**:
    ```json
    {
      "universities": [
        {
          "name": "MIT",
          "location": "Cambridge, MA, USA",
          "ranking": 1,
          "fitScore": 95,
          "reasons": "Strong in Computer Science and Engineering...",
          "website": "https://mit.edu"
        }
      ],
      "aiResponse": "Based on your preferences, here are top universities..."
    }
    ```

### **3.2.4 Preferences Controller**
- **File**: `server/src/controllers/preferencesController.js`
- **Routes**:
    - `POST /api/preferences` (Protected)
    - `GET /api/preferences/:userId` (Protected)
    - `PUT /api/preferences/:userId` (Protected)
    

## **4. Database Schemas (MongoDB)**

### **4.1 User Schema**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### **4.2 Preference Schema**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  academicInterests: [String],
  preferredCountries: [String],
  budgetRange: String,
  testScores: {
    sat: Number,
    act: Number,
    gre: Number,
    gmat: Number,
    toefl: Number,
    ielts: Number
  },
  academicLevel: String,
  languageRequirements: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### **4.3 Recommendation Schema**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  universities: [
    {
      name: String,
      location: String,
      ranking: Number,
      fitScore: Number,
      reasons: String,
      website: String,
      imageUrl: String
    }
  ],
  aiResponse: String,
  createdAt: Date
}
```

## **5. Frontend Components (React)**

### **5.1 Pages**

### **5.1.1 Authentication Pages**
- **Home.jsx**: Landing page with navigation to login/signup
- **Login.jsx**: User authentication form
- **Signup.jsx**: User registration form

### **5.1.2 Core Application Pages**
- **Dashboard.jsx**: Main hub with integrated chat and recommendation sidebar
- **Preferences.jsx**: Comprehensive preference collection form
- **Recommendation.jsx**: Full recommendations view with filtering and search
- **Profile.jsx**: User profile management

### **5.2 Shared Components**

### **5.2.1 ChatInterface**
- **File**: `client/src/components/ChatInterface.jsx`
- **Features**:
    - Shared component used in Dashboard and standalone contexts
    - Real-time chat UI (user messages right, AI left)
    - Automatic preference loading and context awareness
    - API integration with chat endpoints
    - Responsive design with compact mode support

### **5.2.2 Navigation & Layout**
- **Sidebar.jsx**: Navigation sidebar with active state management
- **ProtectedRoute.jsx**: Route protection with authentication and preference validation
- **Common.jsx**: Reusable UI components and utilities

### **5.3 Context & Services**
- **AuthContext**: Global authentication state management
- **API Services**: Centralized API call functions for all endpoints
- **Utils**: Helper functions and utilities

### **5.4 User Experience Flow**
1. **Landing** → **Login/Signup** → **Preferences** (if not set)
2. **Dashboard**: Central hub with chat + recommendation sidebar
3. **Recommendations**: Detailed view with filtering capabilities
4. **Protected Routes**: All main features require authentication and preferences

## **6. Integration Flow**

### **6.1 User Onboarding Flow**
1. **User Registration/Login** → JWT token issued and stored
2. **Preference Check** → Redirect to preferences if not set
3. **Initial Recommendations** → Generated automatically after preference submission
4. **Dashboard Access** → Main application interface unlocked

### **6.2 Chat Integration Flow**
1. **User Sends Message** → ChatInterface component handles input
2. **Preference Context Loading** → Automatic preference retrieval for context
3. **API Request Construction** → Message + user context sent to backend
4. **AI Service Processing** → Backend formats prompt with user preferences
5. **Gemini API Call** → Structured prompt sent to AI service
6. **Response Processing** → AI response formatted and returned
7. **Real-time Display** → Chat interface updates with AI response
8. **Recommendation Trigger** → New recommendations generated if preferences mentioned

### **6.3 Recommendation Generation Flow**
1. **Trigger Event** → Manual generation or preference updates
2. **Data Cleanup** → Old recommendations deleted from database
3. **Preference Integration** → Current user preferences loaded
4. **AI Prompt Construction** → Structured recommendation request
5. **Gemini Processing** → AI generates university recommendations
6. **Data Parsing** → Response parsed into structured university objects
7. **Database Storage** → New recommendations saved with metadata
8. **Frontend Update** → Dashboard and recommendation pages refreshed

### **6.4 Example AI Prompts**

**Chat Prompt Template**:
```
You are a university counselor. User preferences: {JSON preferences}
User question: "{user message}"
Provide helpful guidance considering their preferences.
```

**Recommendation Prompt Template**:
```
Generate university recommendations based on these preferences: {JSON preferences}
Return structured data with university details, fit scores, and reasoning.
```

## **7. Security & Authentication**

### **7.1 Authentication System**
- **JWT-based authentication** for all protected routes
- **Token storage** in localStorage with automatic expiration handling
- **Route protection** via ProtectedRoute component
- **Preference validation** ensuring users complete onboarding

### **7.2 API Security**
- **Environment variables** for sensitive data (API keys, DB URLs)
- **HTTPS enforcement** for all external API calls
- **Input validation** using express-validator to prevent injection
- **CORS configuration** for secure cross-origin requests
- **Password hashing** using bcrypt for user credentials

### **7.3 Data Privacy**
- **User data encryption** for sensitive information
- **Preference data protection** with user-specific access controls
- **Recommendation cleanup** preventing data accumulation
- **Session management** with secure token handling

## **8. Error Handling & Resilience**

### **8.1 AI Service Resilience**
- **Fallback mechanisms** with mock data when AI service unavailable
- **Retry logic** with exponential backoff for API failures
- **Error boundaries** in React components for graceful degradation
- **Validation layers** for AI response parsing

### **8.2 Database Operations**
- **Connection pooling** for MongoDB reliability
- **Transaction support** for data consistency
- **Validation schemas** with Mongoose for data integrity
- **Backup strategies** for recommendation data

## **9. Performance Optimization**

### **9.1 Frontend Optimization**
- **Component reusability** with shared ChatInterface
- **Lazy loading** for route-based code splitting
- **Responsive design** with Tailwind CSS for all devices
- **State management** with React Context for global data

### **9.2 Backend Optimization**
- **API caching** for frequent preference requests
- **Database indexing** for user and recommendation queries
- **Response compression** for large recommendation datasets
- **Rate limiting** to prevent API abuse

## **10. Deployment & Development**

### **10.1 Development Stack**
- **Vite** for fast frontend development and building
- **ESLint** for code quality and consistency
- **Git** version control with feature branch workflow
- **Environment configuration** with separate dev/prod settings

### **10.2 Build Process**
- **Client build** generates optimized static assets
- **Server deployment** with Node.js and Express
- **Environment variables** managed through .env files
- **Database connection** configured for MongoDB Atlas or local instance