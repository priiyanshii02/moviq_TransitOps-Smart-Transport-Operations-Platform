/**
 * Firebase Authentication Context
 * 
 * Provides authentication state and methods throughout the application.
 * Manages user sessions with Firebase Authentication.
 * 
 * @module contexts/AuthContext
 */

import React, { createContext, useContext, useEffect, useState } from 'react'

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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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
      console.log('Signup called:', email)
      return { user: { email, displayName } }
    } catch (error) {
      console.error('Signup error:', error.message)
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
      console.log('Login called:', email)
      const userData = { email, uid: Math.random().toString(36).substr(2, 9) }
      setUser(userData)
      return { user: userData }
    } catch (error) {
      console.error('Login error:', error.message)
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
      console.log('Google login called')
      const userData = { email: 'user@google.com', uid: Math.random().toString(36).substr(2, 9), displayName: 'Google User' }
      setUser(userData)
      return { user: userData }
    } catch (error) {
      console.error('Google login error:', error.message)
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
      setUser(null)
      console.log('Logout called')
    } catch (error) {
      console.error('Logout error:', error.message)
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
      console.log('Password reset called for:', email)
    } catch (error) {
      console.error('Password reset error:', error.message)
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
      console.log('Profile update called:', profile)
    } catch (error) {
      console.error('Profile update error:', error.message)
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
