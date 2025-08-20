# NextStep AI 🎓

> An intelligent university counseling platform powered by AI to help students find their perfect educational match.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)

### Deployed Link:
- Frontend - https://nextstep-ai-three.vercel.app/
- Backend - https://ai-council.onrender.com

## 🎨 Design

The UI/UX design is available on Figma:
[View Design](https://www.figma.com/design/4dK6YoZA7fzZWwADyGNlJi/Untitled?node-id=0-1&t=1BX5ibGGStOd12mi-1)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## 🌟 Overview

NextStep AI is a comprehensive university counseling platform that leverages artificial intelligence to provide personalized university recommendations, interactive chat support, and educational guidance. The platform helps students navigate their academic journey by matching them with suitable universities based on their preferences, academic performance, and career goals.

## ✨ Features

### 🎯 Core Features
- **AI-Powered University Recommendations** - Get personalized university suggestions based on your profile
- **Interactive Chat Interface** - 24/7 AI counselor for educational queries and guidance
- **Smart Preference System** - Multi-step preference setup with academic interests, location, budget, and test scores
- **University Discovery** - Comprehensive university database with detailed information and images
- **Profile Management** - Track your preferences and view recommendation history

### 🎨 User Experience
- **Responsive Design** - Fully optimized for desktop, tablet, and mobile devices
- **Modern UI/UX** - Clean, intuitive interface built with Tailwind CSS
- **Real-time Chat** - Seamless communication with AI counselor
- **Markdown Support** - Rich text formatting in chat responses
- **Mobile-First Design** - Hamburger navigation and touch-friendly interactions

### 🔧 Technical Features
- **Secure Authentication** - User registration and login system
- **RESTful API** - Well-structured backend with comprehensive endpoints
- **Error Handling** - Robust error management and user feedback
- **Performance Optimized** - Fast loading times and smooth interactions

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Markdown** - Markdown rendering for chat responses
- **React Icons** - Comprehensive icon library

### Backend
- **Node.js** - Server-side JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for data storage
- **Mongoose** - MongoDB object modeling
- **Google Gemini AI** - AI-powered recommendations and chat

### Tools & Utilities
- **ESLint** - Code linting and quality
- **Git** - Version control
- **npm** - Package management

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **MongoDB** (local or Atlas)
- **Git**

### Environment Variables

Create `.env` files in both client and server directories:

#### Server `.env`
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-council
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

#### Client `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rohit-xo21/AI-Council.git
   cd AI-Council
   ```

2. **Install server dependencies**
   ```bash
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

4. **Set up environment variables**
   - Create `.env` files as described above
   - Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/)
   - Set up MongoDB connection string

## 🎮 Usage

### Development Mode

1. **Start the server** (from root directory)
   ```bash
   npm run dev
   ```

2. **Start the client** (from client directory)
   ```bash
   cd client
   npm run dev
   ```

3. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5000`

### Production Build

1. **Build the client**
   ```bash
   cd client
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Preferences Endpoints
- `GET /api/preferences` - Get user preferences
- `POST /api/preferences` - Save user preferences
- `PUT /api/preferences` - Update user preferences

### Recommendations Endpoints
- `GET /api/recommendations` - Get user recommendations
- `POST /api/recommendations/generate` - Generate new recommendations

### Chat Endpoints
- `POST /api/chat/message` - Send chat message
- `GET /api/chat/history` - Get chat history

## 📁 Project Structure

```
AI-Council/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service functions
│   │   ├── utils/         # Utility functions
│   │   └── config/        # Configuration files
│   ├── package.json
│   └── vite.config.js
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── services/      # Business logic services
│   │   └── utils/         # Utility functions
│   ├── package.json
│   └── app.js
├── docs/                  # Documentation
├── design.md             # Design specifications
├── README.md
└── package.json
```



## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed



## 🙏 Acknowledgments

- Google Gemini AI for intelligent recommendations
- Unsplash for university images
- Tailwind CSS for styling framework
- React community for excellent documentation

---

<div align="center">
  <p>Made with ❤️ for students worldwide</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>