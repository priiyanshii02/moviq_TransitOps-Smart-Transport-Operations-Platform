import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useAuth } from '../../../contexts/AuthContext'

const Register = () => {
  const navigate = useNavigate()
  const { signup, loginWithGoogle } = useAuth()
  
  // Form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  /**
   * Handle user registration
   */
  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      await signup(email, password, name)
      setSuccess('Account created successfully! Please check your email for verification. Redirecting to login...')
      setTimeout(() => {
        navigate('/login-old')
      }, 3000)
    } catch (err) {
      const errorMessage = err.message
        .replace('Firebase: ', '')
        .replace(/\(auth\/[^)]+\)/, '')
        .trim()
      setError(errorMessage || 'Failed to create account. Please try again.')
      setLoading(false)
    }
  }

  /**
   * Handle Google OAuth registration
   */
  const handleGoogleRegister = async () => {
    setLoading(true)
    setError('')

    try {
      await loginWithGoogle()
      navigate('/dashboard')
    } catch (err) {
      const errorMessage = err.message
        .replace('Firebase: ', '')
        .replace(/\(auth\/[^)]+\)/, '')
        .trim()
      setError(errorMessage || 'Failed to sign up with Google.')
      setLoading(false)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleRegister}>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>
                  
                  {/* Error Alert */}
                  {error && (
                    <CAlert color="danger" dismissible onClose={() => setError('')}>
                      {error}
                    </CAlert>
                  )}
                  
                  {/* Success Alert */}
                  {success && (
                    <CAlert color="success">
                      {success}
                    </CAlert>
                  )}
                  
                  {/* Name Input */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput 
                      placeholder="Full Name" 
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </CInputGroup>
                  
                  {/* Email Input */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput 
                      type="email"
                      placeholder="Email" 
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </CInputGroup>
                  
                  {/* Password Input */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password (min 6 characters)"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </CInputGroup>
                  
                  {/* Confirm Password Input */}
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </CInputGroup>
                  
                  {/* Submit Button */}
                  <div className="d-grid mb-3">
                    <CButton 
                      color="success" 
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? <CSpinner size="sm" /> : 'Create Account'}
                    </CButton>
                  </div>
                  
                  {/* Divider */}
                  <div className="text-center mb-3">
                    <small className="text-body-secondary">OR</small>
                  </div>
                  
                  {/* Google Sign Up Button */}
                  <div className="d-grid mb-3">
                    <CButton 
                      color="light" 
                      className="border"
                      onClick={handleGoogleRegister}
                      disabled={loading}
                      type="button"
                    >
                      <svg className="me-2" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                        <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853"/>
                        <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                        <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.002 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
                      </svg>
                      Sign up with Google
                    </CButton>
                  </div>
                  
                  {/* Login Link */}
                  <div className="text-center">
                    <small className="text-body-secondary">
                      Already have an account?{' '}
                      <Link to="/login-old">Login here</Link>
                    </small>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
