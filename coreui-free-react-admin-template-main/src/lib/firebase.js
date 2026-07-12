/**
 * Firebase Configuration
 * 
 * Initializes Firebase app with configuration from environment variables.
 * Provides authentication and analytics services.
 * 
 * @module lib/firebase
 */

import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// Validate Firebase configuration
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain) {
  console.error('❌ Missing Firebase configuration. Please check your .env file.')
  console.log('Required variables:')
  console.log('- VITE_FIREBASE_API_KEY')
  console.log('- VITE_FIREBASE_AUTH_DOMAIN')
  console.log('- VITE_FIREBASE_PROJECT_ID')
  console.log('- VITE_FIREBASE_STORAGE_BUCKET')
  console.log('- VITE_FIREBASE_MESSAGING_SENDER_ID')
  console.log('- VITE_FIREBASE_APP_ID')
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication
export const auth = getAuth(app)

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account',
})

// Initialize Firebase Analytics (optional)
let analytics = null
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app)
  } catch (error) {
    console.warn('Firebase Analytics not initialized:', error.message)
  }
}

export { analytics }

console.log('✅ Firebase initialized successfully')
console.log('📧 Auth domain:', firebaseConfig.authDomain)
