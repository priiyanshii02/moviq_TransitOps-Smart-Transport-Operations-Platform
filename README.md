# TransitOps - Smart Transport Operations Platform

A modern, responsive React + Vite + CoreUI admin dashboard for managing fleet operations, maintenance, fuel expenses, and analytics.

## 🚀 Features

- **Dashboard** - Real-time fleet overview and key metrics
- **Fleet Management** - Vehicle registry and fleet control
- **Maintenance Tracking** - Schedule and track vehicle maintenance
- **Fuel & Expenses** - Manage fuel logs and operational expenses
- **Analytics & Reports** - Comprehensive analytics and reporting
- **Settings & RBAC** - Configure system settings and role-based access control
- **Dark/Light Theme** - Automatic theme switching support
- **Firebase Authentication** - Secure user authentication with Firebase

## 📋 Prerequisites

- Node.js 16+ and npm
- Firebase project (credentials provided in `.env`)
- Modern web browser

## 🔧 Installation

### 1. Clone the Repository

```bash
cd coreui-free-react-admin-template-main
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

The `.env` file is already configured with Firebase credentials:

```env
VITE_FIREBASE_API_KEY=AIzaSyA0gO1r-B7moKtOjz7p4xvnUJHuQumJnBA
VITE_FIREBASE_AUTH_DOMAIN=oodo-38480.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=oodo-38480
VITE_FIREBASE_STORAGE_BUCKET=oodo-38480.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=199009259776
VITE_FIREBASE_APP_ID=1:199009259776:web:bee28ccfee6f9c4ba2e3e5
VITE_FIREBASE_MEASUREMENT_ID=G-JVH7BDDJ9N
```

**⚠️ Security Note:** These are placeholder credentials. For production:
1. Create your own Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Replace these credentials with your project's credentials
3. Never commit real credentials to version control
4. Use environment-specific `.env` files

### 4. Start Development Server

```bash
npm start
```

The application will run on **http://localhost:3000** with:
- Hot module replacement (HMR)
- Port: 3000 (strict, cannot fallback)
- Hash-based routing enabled

## 🔐 Authentication System

### Architecture

The authentication system uses Firebase with a context-based state management approach:

```
App.jsx (HashRouter)
  ↓
AuthProvider (AuthContext.jsx)
  ↓
ProtectedRoute (guards routes)
  ↓
DefaultLayout (Sidebar + Header + Content)
  ↓
AppContent (routes configuration)
```

### File Structure

```
src/
├── contexts/
│   └── AuthContext.jsx          # Auth state management & Firebase integration
├── components/
│   ├── ProtectedRoute.jsx       # Route protection wrapper
│   ├── AppHeader.jsx            # Header with theme switcher
│   ├── AppSidebar.jsx           # Navigation sidebar
│   └── header/
│       └── AppHeaderDropdown.jsx # User profile dropdown
├── views/
│   ├── pages/login/
│   │   └── AnimatedLogin.jsx    # Login page with animated characters
│   ├── dashboard/
│   ├── maintenance/
│   ├── fuelExpenses/
│   ├── analytics/
│   └── settings/
├── lib/
│   └── firebase.js              # Firebase configuration
└── routes.js                    # Route definitions
```

### Authentication Flow

#### 1. **Login Process**

```javascript
// User enters credentials
const { login } = useAuth()
await login(email, password)
// Firebase authenticates user
// AuthContext updates user state
// User redirected to dashboard
```

#### 2. **Protected Routes**

```javascript
<Route
  path="/dashboard/*"
  element={
    <ProtectedRoute>
      <DefaultLayout />
    </ProtectedRoute>
  }
/>
```

Any unauthenticated user trying to access `/dashboard/*` is redirected to `/login`.

#### 3. **User State Persistence**

Firebase automatically restores user sessions from local storage on app reload.

### Key Components

#### AuthContext.jsx

Provides authentication state and methods:

```javascript
const { 
  user,           // Current user object
  login,          // Email/password login
  loginWithGoogle,// Google OAuth login
  logout,         // Sign out user
  signup,         // Create new account
  resetPassword,  // Password reset
  updateUserProfile, // Update user profile
  loading,        // Loading state
  error          // Error message
} = useAuth()
```

#### ProtectedRoute.jsx

Wraps routes to ensure only authenticated users can access them:

```javascript
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

If user is not authenticated → redirects to `/login`
If user is authenticated → renders component

#### AnimatedLogin.jsx

Interactive login page with:
- Email/password form
- Google OAuth button
- Animated character elements
- Password visibility toggle
- Remember me checkbox

### Firebase Integration

#### Setup Instructions for Teammate

1. **Install Firebase SDK** (if not already installed):
```bash
npm install firebase
```

2. **Update `firebase.js`** with actual Firebase initialization:

```javascript
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
```

3. **Update `AuthContext.jsx`** with Firebase authentication methods

4. **Enable Firebase Authentication Methods**:
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Project Settings → Authentication
   - Enable: Email/Password, Google OAuth

5. **Configure Google OAuth**:
   - Add your domain to authorized domains in Firebase Console
   - Get OAuth credentials from Google Cloud Console

### Login Credentials

For testing with mock authentication:
- **Email:** any email (e.g., test@gmail.com)
- **Password:** any password

For production Firebase:
- Users must be registered in Firebase Authentication
- Email verification can be enabled in Firebase Console

## 📁 Project Structure

```
src/
├── _nav.jsx                     # Sidebar navigation config
├── App.jsx                      # Root component with routing
├── assets/                      # Images, icons, branding
├── components/                  # Reusable components
├── contexts/                    # React Context (Auth)
├── layout/                      # Layout components
├── lib/                         # Firebase & utilities
├── scss/                        # Stylesheets
├── views/                       # Page components
│   ├── dashboard/              # Dashboard page
│   ├── maintenance/            # Maintenance page
│   ├── fuelExpenses/          # Fuel & Expenses page
│   ├── analytics/             # Analytics page
│   ├── settings/              # Settings & RBAC page
│   └── pages/                 # Auth pages (login, register)
└── routes.js                   # Route definitions
```

## 🎨 Available Scripts

```bash
# Start development server (port 3000)
npm start

# Build for production
npm build

# Preview production build
npm serve

# Run ESLint
npm lint
```

## 🔌 Routing Configuration

The app uses hash-based routing (`/#/`):

- **Login:** `http://localhost:3000/#/login`
- **Dashboard:** `http://localhost:3000/#/dashboard`
- **Maintenance:** `http://localhost:3000/#/dashboard/maintenance`
- **Fuel & Expenses:** `http://localhost:3000/#/dashboard/fuel-expenses`
- **Analytics:** `http://localhost:3000/#/dashboard/analytics`
- **Settings:** `http://localhost:3000/#/dashboard/settings`

## 🎯 Navigation Structure

### Sidebar Menu

```
TransitOps
├── Dashboard
├── Fleet Management
│   └── Vehicle Registry
├── Drivers
├── Trips
├── Maintenance
├── Fuel & Expenses
├── Analytics
└── Settings
```

### Header Controls

- **Left:** Sidebar toggle
- **Center:** Breadcrumb navigation
- **Right:**
  - Notification bell
  - Menu icon
  - Email icon
  - Theme switcher (Light/Dark/Auto)
  - User profile dropdown

## 🎨 Theme Support

The app supports three themes:

1. **Light** - Bright, professional theme
2. **Dark** - Dark theme for reduced eye strain
3. **Auto** - Follows system preference

Theme preference is persisted in localStorage.

## 📊 Pages Overview

### Dashboard
- Fleet statistics and KPIs
- Real-time vehicle status
- Quick action buttons

### Fleet Management
- Vehicle registry with details
- Fleet utilization metrics
- Vehicle status tracking

### Maintenance
- Maintenance request form
- Service history log
- Status tracking (Available/In Shop/Completed)

### Fuel & Expenses
- Fuel consumption logs
- Operational expense tracking
- Total cost calculation

### Analytics
- Fuel efficiency metrics
- Fleet utilization reports
- Operational cost analysis
- Vehicle ROI calculations
- Export CSV functionality

### Settings
- General configuration
  - Depot name
  - Currency selection
  - Distance unit preference
- Role-Based Access Control (RBAC) matrix
  - Roles: Fleet Manager, Dispatcher, Safety Officer, Financial Analyst
  - Permissions display

## 🔒 Security Considerations

1. **Authentication**
   - Firebase handles secure password hashing
   - Sessions auto-expire after inactivity
   - Multi-factor authentication available in Firebase Console

2. **Data Protection**
   - Use HTTPS in production
   - Firebase Firestore security rules (configure in Console)
   - Environment variables for sensitive data

3. **Best Practices**
   - Never commit real Firebase credentials
   - Use different Firebase projects for dev/prod
   - Enable Firebase security rules before production deployment

## 🚀 Deployment

### Build for Production

```bash
npm build
```

Creates optimized build in `build/` directory.

### Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase deploy
```

### Deploy to Other Platforms

The built files in `build/` can be deployed to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages (with router configuration)
- Docker container

## 📦 Dependencies

Key packages:
- **React 19** - UI framework
- **React Router 7** - Client-side routing
- **CoreUI React** - Component library
- **Firebase** - Authentication & backend
- **Redux** - State management
- **Vite** - Build tool
- **Chart.js** - Data visualization

Full list: see `package.json`

## 🐛 Troubleshooting

### Port 3000 Already in Use

If port 3000 is occupied, the server won't start (strictPort: true). Kill the process:

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### Firebase Errors

- **"Failed to resolve import 'firebase/auth'"**
  - Ensure Firebase SDK is installed: `npm install firebase`
  - Verify `firebase.js` has correct imports

- **"Invalid API Key"**
  - Check `.env` file has correct Firebase credentials
  - Verify credentials in Firebase Console

- **Authentication not working**
  - Enable authentication methods in Firebase Console
  - Check CORS settings for your domain
  - Verify Google OAuth is configured

### Theme Not Persisting

- Clear browser localStorage
- Check theme switcher in header
- Verify `useColorModes` hook is working

## 📞 Support & Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [CoreUI Documentation](https://coreui.io/react/docs/)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)

## 📝 Notes for Development Team

### Current Implementation Status

✅ **Completed:**
- UI/UX with CoreUI components
- Routing structure (hash-based)
- Context-based state management
- All dashboard pages (Dashboard, Maintenance, Fuel & Expenses, Analytics, Settings)
- Mock authentication (functional for testing)
- Dark/Light theme support
- Responsive design

⏳ **TODO (Firebase Implementation):**
- Replace mock authentication with Firebase Auth SDK
- Implement real user signup/login
- Add email verification
- Setup Google OAuth
- Configure password reset
- Add user session persistence
- Enable Firestore database integration (optional)
- Setup Firebase security rules

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/auth-integration

# Make changes and test
npm start

# Build test
npm build

# Commit with clear message
git commit -m "feat: implement Firebase authentication"

# Push to feature branch
git push origin feature/auth-integration

# Create pull request for team review
```

## 📄 License

MIT License - See LICENSE file for details

---

**Happy Coding! 🚀**

For questions or issues, reach out to the development team.
