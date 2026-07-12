/**
 * Protected Route Component
 * 
 * Wraps routes that require authentication.
 * Redirects unauthenticated users to the login page.
 * 
 * @module components/ProtectedRoute
 */

import React from 'react'
import { Navigate } from 'react-router-dom'
import { CSpinner } from '@coreui/react'
import { useAuth } from '../contexts/AuthContext'

/**
 * ProtectedRoute Component
 * 
 * Checks if user is authenticated before rendering children.
 * Shows loading spinner while checking auth state.
 * Redirects to login if not authenticated.
 * 
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Protected content to render
 * 
 * @returns {React.ReactElement} Protected content or redirect
 * 
 * @example
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <CSpinner color="primary" variant="grow" />
          <p className="mt-3 text-body-secondary">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log('🔒 User not authenticated, redirecting to login')
    return <Navigate to="/login" replace />
  }

  // Render protected content if authenticated
  console.log('✅ User authenticated:', user.email)
  return children
}

export default ProtectedRoute
