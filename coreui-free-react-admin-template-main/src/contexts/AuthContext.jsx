/**
 * Firebase Authentication Context
 * 
 * Provides authentication state and methods throughout the application.
 * Manages user sessions with Firebase Authentication.
 * 
 * @module contexts/AuthContext
 */

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth'
import { auth, googleProvider } from '../lib/firebase'

// Create Auth Context
const AuthContext = createContext({})

/**
 * Custom hook to access authentication context
 * 
 * @returns {Object} Authentication context value
 * @throws {Error} If used outside AuthProvider
 * 
 * @example
 * const { user, login, logout } = useAuth()
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

/**
 * Authentication Provider Component
 * 
 * Wraps the application to provide authentication state and methods.
 * Automatically syncs with Firebase auth state changes.
 * 
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * 
 * @example
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('🔥 Auth state changed:', currentUser?.email || 'No user')
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  /**
   * Sign up with email and password
   * 
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} displayName - User display name (optional)
   * @returns {Promise<Object>} Firebase user object
   */
  const signup = async (email, password, displayName = null) => {
    try {
      setError(null)
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update profile with display name if provided
      if (displayName && result.user) {
        await updateProfile(result.user, { displayName })
      }
      
      // Send email verification
      if (result.user) {
        await sendEmailVerification(result.user)
      }
      
      console.log('✅ Signup successful:', email)
      return result
    } catch (error) {
      console.error('❌ Signup error:', error.message)
      setError(error.message)
      throw error
    }
  }

  /**
   * Sign in with email and password
   * 
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Firebase user object
   */
  const login = async (email, password) => {
    try {
      setError(null)
      const result = await signInWithEmailAndPassword(auth, email, password)
      console.log('✅ Login successful:', email)
      return result
    } catch (error) {
      console.error('❌ Login error:', error.message)
      setError(error.message)
      throw error
    }
  }

  /**
   * Sign in with Google
   * 
   * @returns {Promise<Object>} Firebase user object
   */
  const loginWithGoogle = async () => {
    try {
      setError(null)
      const result = await signInWithPopup(auth, googleProvider)
      console.log('✅ Google login successful:', result.user.email)
      return result
    } catch (error) {
      console.error('❌ Google login error:', error.message)
      setError(error.message)
      throw error
    }
  }

  /**
   * Sign out the current user
   * 
   * @returns {Promise<void>}
   */
  const logout = async () => {
    try {
      setError(null)
      await signOut(auth)
      console.log('✅ Logout successful')
    } catch (error) {
      console.error('❌ Logout error:', error.message)
      setError(error.message)
      throw error
    }
  }

  /**
   * Send password reset email
   * 
   * @param {string} email - User email
   * @returns {Promise<void>}
   */
  const resetPassword = async (email) => {
    try {
      setError(null)
      await sendPasswordResetEmail(auth, email)
      console.log('✅ Password reset email sent to:', email)
    } catch (error) {
      console.error('❌ Password reset error:', error.message)
      setError(error.message)
      throw error
    }
  }

  /**
   * Update user profile
   * 
   * @param {Object} profile - Profile data to update
   * @returns {Promise<void>}
   */
  const updateUserProfile = async (profile) => {
    try {
      setError(null)
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, profile)
        console.log('✅ Profile updated')
      }
    } catch (error) {
      console.error('❌ Profile update error:', error.message)
      setError(error.message)
      throw error
    }
  }

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    loginWithGoogle,
    resetPassword,
    updateUserProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
