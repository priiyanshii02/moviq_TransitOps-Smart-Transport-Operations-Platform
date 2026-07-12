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

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// Validate configuration
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.error('❌ Firebase configuration error - Missing required environment variables')
  console.error('Current config:', {
    apiKey: firebaseConfig.apiKey ? '✅ Set' : '❌ Missing',
    authDomain: firebaseConfig.authDomain ? '✅ Set' : '❌ Missing',
    projectId: firebaseConfig.projectId ? '✅ Set' : '❌ Missing',
  })
  throw new Error('Firebase configuration is incomplete. Check your .env file.')
}

// Initialize Firebase
console.log('🔥 Initializing Firebase...')
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication
export const auth = getAuth(app)
console.log('✅ Firebase Auth initialized')

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account', // Always show account picker
})
console.log('✅ Google Auth Provider configured')

// Initialize Firebase Analytics (optional)
let analytics = null
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app)
    console.log('✅ Firebase Analytics initialized')
  } catch (error) {
    console.warn('⚠️ Firebase Analytics not initialized:', error.message)
  }
}

export { analytics }

console.log('✅ Firebase initialization complete')
console.log('📧 Auth domain:', firebaseConfig.authDomain)
console.log('🆔 Project ID:', firebaseConfig.projectId)
