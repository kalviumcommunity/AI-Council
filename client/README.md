# AI-Council Frontend

A React-based frontend for the AI-powered student guidance platform that provides university recommendations and chatbot assistance.

## Features

- **Home Page**: Landing page with hero section and navigation
- **Authentication**: User registration and login
- **Preferences Form**: Collects user preferences for personalized recommendations
- **Dashboard**: Displays university recommendations with integrated chat
- **Chat Interface**: Dedicated chat page for AI counselor conversations
- **Responsive Design**: Tailwind CSS for mobile-first responsive design

## Tech Stack

- **React 19** - Frontend framework
- **Vite** - Build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Common.jsx      # Common UI components (Button, Input, etc.)
│   └── ProtectedRoute.jsx
├── context/            # React contexts
│   └── AuthContext.jsx # Authentication context
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── Login.jsx       # Login page
│   ├── Signup.jsx      # Registration page
│   ├── Preferences.jsx # Preferences form
│   ├── Dashboard.jsx   # University recommendations + chat
│   └── Chat.jsx        # Dedicated chat interface
├── services/           # API services
│   └── api.js          # API configuration and endpoints
├── utils/              # Utility functions and hooks
│   └── useAuth.js      # Authentication hook
├── App.jsx             # Main app component with routing
└── main.jsx            # App entry point
```

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   - Copy `.env` file and update values as needed
   - Update the `VITE_API_URL` to point to your backend server

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

- `VITE_API_URL` - Backend API URL (default: http://localhost:5000/api)
- `VITE_NODE_ENV` - Environment mode

## Pages Overview

### Home (`/`)
- Hero section with call-to-action
- Navigation to login/signup
- Responsive design with gradient background

### Authentication (`/login`, `/signup`)
- Clean form designs
- Form validation
- Loading states
- Error handling

### Preferences (`/preferences`)
- Multi-step form for user preferences
- Dropdown selections for study fields, levels, budget
- Text areas for career goals and requirements

### Dashboard (`/dashboard`)
- University recommendation cards
- Integrated chat interface
- University details with match percentages
- Quick actions (Learn More, Save)

### Chat (`/chat`)
- Full-screen chat interface
- Real-time typing indicators
- Quick question suggestions
- Message history

## Backend Integration

The frontend is designed to work with a Node.js/Express backend that provides:

- Authentication endpoints (`/auth/login`, `/auth/signup`)
- Preferences management (`/preferences`)
- University recommendations (`/universities/recommendations`)
- Chat functionality (`/chat/message`)

## Styling

Uses Tailwind CSS for:
- Responsive design
- Custom color schemes
- Component styling
- Animations and transitions
