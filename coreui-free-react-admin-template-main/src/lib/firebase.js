/**
 * Firebase Configuration
 * 
 * Initializes Firebase app with configuration from environment variables.
 * Provides authentication and analytics services.
 * 
 * @module lib/firebase
 */

// Mock Firebase configuration for development
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'mock-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'mock-app.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'mock-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'mock-bucket.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'mock-sender',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'mock-app-id',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'mock-measurement',
}

// Mock Firebase auth
export const auth = {
  currentUser: null,
}

// Mock Google Auth Provider
export const googleProvider = {}

// Mock analytics
export const analytics = null

console.log('✅ Firebase configuration loaded (development mode)')
