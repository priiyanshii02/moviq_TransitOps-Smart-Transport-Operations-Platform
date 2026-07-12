/**
 * Authentication Context
 * 
 * Provides authentication state and methods throughout the application.
 * Uses mock authentication for development (no Firebase).
 * 
 * @module contexts/AuthContext
 */

import React, { createContext, useContext, useState } from 'react'

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
 * Uses mock authentication for development.
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Sign up with email and password
   * 
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} displayName - User display name (optional)
   * @returns {Promise<Object>} User object
   */
  const signup = async (email, password, displayName = null) => {
    try {
      setError(null)
      console.log('📝 Creating user account:', email)
      const userData = {
        email,
        uid: Math.random().toString(36).substr(2, 9),
        displayName: displayName || email,
      }
      setUser(userData)
      console.log('✅ Signup successful:', email)
      return { user: userData }
    } catch (err) {
      console.error('❌ Signup error:', err.message)
      setError(err.message)
      throw err
    }
  }

  /**
   * Sign in with email and password
   * 
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User object
   */
  const login = async (email, password) => {
    try {
      setError(null)
      console.log('🔐 Attempting login for:', email)
      const userData = {
        email,
        uid: Math.random().toString(36).substr(2, 9),
        displayName: 'User',
      }
      setUser(userData)
      console.log('✅ Login successful:', email)
      return { user: userData }
    } catch (err) {
      console.error('❌ Login error:', err.message)
      setError(err.message)
      throw err
    }
  }

  /**
   * Sign in with Google
   * 
   * @returns {Promise<Object>} User object
   */
  const loginWithGoogle = async () => {
    try {
      setError(null)
      console.log('🔐 Attempting Google login...')
      const userData = {
        email: 'user@google.com',
        uid: Math.random().toString(36).substr(2, 9),
        displayName: 'Google User',
      }
      setUser(userData)
      console.log('✅ Google login successful')
      return { user: userData }
    } catch (err) {
      console.error('❌ Google login error:', err.message)
      setError(err.message)
      throw err
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
      console.log('🚪 Signing out user:', user?.email)
      setUser(null)
      console.log('✅ Logout successful')
    } catch (err) {
      console.error('❌ Logout error:', err.message)
      setError(err.message)
      throw err
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
      console.log('📧 Password reset requested for:', email)
    } catch (err) {
      console.error('❌ Password reset error:', err.message)
      setError(err.message)
      throw err
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
      if (user) {
        console.log('👤 Updating user profile:', profile)
        setUser({ ...user, ...profile })
        console.log('✅ Profile updated')
      } else {
        throw new Error('No user logged in')
      }
    } catch (err) {
      console.error('❌ Profile update error:', err.message)
      setError(err.message)
      throw err
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
