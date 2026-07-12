import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CButton, CForm, CFormInput, CFormLabel, CFormCheck } from '@coreui/react'
import { Eye, EyeOff, Mail, Sparkles } from 'lucide-react'
import './AnimatedLogin.css'

const Pupil = ({ size = 12, maxDistance = 5, pupilColor = 'black', forceLookX, forceLookY }) => {
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const pupilRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouseX(e.clientX)
      setMouseY(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const calculatePupilPosition = () => {
    if (!pupilRef.current) return { x: 0, y: 0 }
    if (forceLookX !== undefined && forceLookY !== undefined) {
      return { x: forceLookX, y: forceLookY }
    }

    const pupil = pupilRef.current.getBoundingClientRect()
    const pupilCenterX = pupil.left + pupil.width / 2
    const pupilCenterY = pupil.top + pupil.height / 2
    const deltaX = mouseX - pupilCenterX
    const deltaY = mouseY - pupilCenterY
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance)
    const angle = Math.atan2(deltaY, deltaX)
    const x = Math.cos(angle) * distance
    const y = Math.sin(angle) * distance
    return { x, y }
  }

  const pupilPosition = calculatePupilPosition()

  return (
    <div
      ref={pupilRef}
      className="pupil"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: pupilColor,
        transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
      }}
    />
  )
}

const EyeBall = ({
  size = 48,
  pupilSize = 16,
  maxDistance = 10,
  eyeColor = 'white',
  pupilColor = 'black',
  isBlinking = false,
  forceLookX,
  forceLookY,
}) => {
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const eyeRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouseX(e.clientX)
      setMouseY(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const calculatePupilPosition = () => {
    if (!eyeRef.current) return { x: 0, y: 0 }
    if (forceLookX !== undefined && forceLookY !== undefined) {
      return { x: forceLookX, y: forceLookY }
    }

    const eye = eyeRef.current.getBoundingClientRect()
    const eyeCenterX = eye.left + eye.width / 2
    const eyeCenterY = eye.top + eye.height / 2
    const deltaX = mouseX - eyeCenterX
    const deltaY = mouseY - eyeCenterY
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance)
    const angle = Math.atan2(deltaY, deltaX)
    const x = Math.cos(angle) * distance
    const y = Math.sin(angle) * distance
    return { x, y }
  }

  const pupilPosition = calculatePupilPosition()

  return (
    <div
      ref={eyeRef}
      className="eyeball"
      style={{
        width: `${size}px`,
        height: isBlinking ? '2px' : `${size}px`,
        backgroundColor: eyeColor,
      }}
    >
      {!isBlinking && (
        <div
          className="pupil"
          style={{
            width: `${pupilSize}px`,
            height: `${pupilSize}px`,
            backgroundColor: pupilColor,
            transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
          }}
        />
      )}
    </div>
  )
}

function AnimatedLogin() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const [isPurpleBlinking, setIsPurpleBlinking] = useState(false)
  const [isBlackBlinking, setIsBlackBlinking] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false)
  const [isPurplePeeking, setIsPurplePeeking] = useState(false)

  const purpleRef = useRef(null)
  const blackRef = useRef(null)
  const yellowRef = useRef(null)
  const orangeRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouseX(e.clientX)
      setMouseY(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const getRandomBlinkInterval = () => Math.random() * 4000 + 3000
    const scheduleBlink = () => {
      const blinkTimeout = setTimeout(() => {
        setIsPurpleBlinking(true)
        setTimeout(() => {
          setIsPurpleBlinking(false)
          scheduleBlink()
        }, 150)
      }, getRandomBlinkInterval())
      return blinkTimeout
    }
    const timeout = scheduleBlink()
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    const getRandomBlinkInterval = () => Math.random() * 4000 + 3000
    const scheduleBlink = () => {
      const blinkTimeout = setTimeout(() => {
        setIsBlackBlinking(true)
        setTimeout(() => {
          setIsBlackBlinking(false)
          scheduleBlink()
        }, 150)
      }, getRandomBlinkInterval())
      return blinkTimeout
    }
    const timeout = scheduleBlink()
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (isTyping) {
      setIsLookingAtEachOther(true)
      const timer = setTimeout(() => {
        setIsLookingAtEachOther(false)
      }, 800)
      return () => clearTimeout(timer)
    } else {
      setIsLookingAtEachOther(false)
    }
  }, [isTyping])

  useEffect(() => {
    if (password.length > 0 && showPassword) {
      const schedulePeek = () => {
        const peekInterval = setTimeout(() => {
          setIsPurplePeeking(true)
          setTimeout(() => {
            setIsPurplePeeking(false)
          }, 800)
        }, Math.random() * 3000 + 2000)
        return peekInterval
      }
      const firstPeek = schedulePeek()
      return () => clearTimeout(firstPeek)
    } else {
      setIsPurplePeeking(false)
    }
  }, [password, showPassword, isPurplePeeking])

  const calculatePosition = (ref) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 }
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 3
    const deltaX = mouseX - centerX
    const deltaY = mouseY - centerY
    const faceX = Math.max(-15, Math.min(15, deltaX / 20))
    const faceY = Math.max(-10, Math.min(10, deltaY / 30))
    const bodySkew = Math.max(-6, Math.min(6, -deltaX / 120))
    return { faceX, faceY, bodySkew }
  }

  const purplePos = calculatePosition(purpleRef)
  const blackPos = calculatePosition(blackRef)
  const yellowPos = calculatePosition(yellowRef)
  const orangePos = calculatePosition(orangeRef)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 500))

    // Always allow login for now - authentication will be added later
    console.log('✅ Login successful!')
    localStorage.setItem('isAuthenticated', 'true')
    navigate('/dashboard')
    
    setIsLoading(false)
  }

  return (
    <div className="animated-login-container">
      {/* Left Content Section */}
      <div className="left-section">
        <div className="logo-section">
          <div className="logo-icon">
            <Sparkles size={16} />
          </div>
          <span>Fleet Manager</span>
        </div>

        <div className="characters-container">
          {/* Purple tall rectangle character */}
          <div
            ref={purpleRef}
            className="character purple-character"
            style={{
              left: '70px',
              width: '180px',
              height:
                isTyping || (password.length > 0 && !showPassword) ? '440px' : '400px',
              transform:
                password.length > 0 && showPassword
                  ? `skewX(0deg)`
                  : isTyping || (password.length > 0 && !showPassword)
                    ? `skewX(${(purplePos.bodySkew || 0) - 12}deg) translateX(40px)`
                    : `skewX(${purplePos.bodySkew || 0}deg)`,
            }}
          >
            <div
              className="eyes"
              style={{
                left:
                  password.length > 0 && showPassword
                    ? `${20}px`
                    : isLookingAtEachOther
                      ? `${55}px`
                      : `${45 + purplePos.faceX}px`,
                top:
                  password.length > 0 && showPassword
                    ? `${35}px`
                    : isLookingAtEachOther
                      ? `${65}px`
                      : `${40 + purplePos.faceY}px`,
              }}
            >
              <EyeBall
                size={18}
                pupilSize={7}
                maxDistance={5}
                eyeColor="white"
                pupilColor="#2D2D2D"
                isBlinking={isPurpleBlinking}
                forceLookX={
                  password.length > 0 && showPassword
                    ? isPurplePeeking
                      ? 4
                      : -4
                    : isLookingAtEachOther
                      ? 3
                      : undefined
                }
                forceLookY={
                  password.length > 0 && showPassword
                    ? isPurplePeeking
                      ? 5
                      : -4
                    : isLookingAtEachOther
                      ? 4
                      : undefined
                }
              />
              <EyeBall
                size={18}
                pupilSize={7}
                maxDistance={5}
                eyeColor="white"
                pupilColor="#2D2D2D"
                isBlinking={isPurpleBlinking}
                forceLookX={
                  password.length > 0 && showPassword
                    ? isPurplePeeking
                      ? 4
                      : -4
                    : isLookingAtEachOther
                      ? 3
                      : undefined
                }
                forceLookY={
                  password.length > 0 && showPassword
                    ? isPurplePeeking
                      ? 5
                      : -4
                    : isLookingAtEachOther
                      ? 4
                      : undefined
                }
              />
            </div>
          </div>

          {/* Black tall rectangle character */}
          <div
            ref={blackRef}
            className="character black-character"
            style={{
              left: '240px',
              width: '120px',
              height: '310px',
              transform:
                password.length > 0 && showPassword
                  ? `skewX(0deg)`
                  : isLookingAtEachOther
                    ? `skewX(${(blackPos.bodySkew || 0) * 1.5 + 10}deg) translateX(20px)`
                    : isTyping || (password.length > 0 && !showPassword)
                      ? `skewX(${(blackPos.bodySkew || 0) * 1.5}deg)`
                      : `skewX(${blackPos.bodySkew || 0}deg)`,
            }}
          >
            <div
              className="eyes"
              style={{
                left:
                  password.length > 0 && showPassword
                    ? `${10}px`
                    : isLookingAtEachOther
                      ? `${32}px`
                      : `${26 + blackPos.faceX}px`,
                top:
                  password.length > 0 && showPassword
                    ? `${28}px`
                    : isLookingAtEachOther
                      ? `${12}px`
                      : `${32 + blackPos.faceY}px`,
              }}
            >
              <EyeBall
                size={16}
                pupilSize={6}
                maxDistance={4}
                eyeColor="white"
                pupilColor="#2D2D2D"
                isBlinking={isBlackBlinking}
                forceLookX={
                  password.length > 0 && showPassword
                    ? -4
                    : isLookingAtEachOther
                      ? 0
                      : undefined
                }
                forceLookY={
                  password.length > 0 && showPassword
                    ? -4
                    : isLookingAtEachOther
                      ? -4
                      : undefined
                }
              />
              <EyeBall
                size={16}
                pupilSize={6}
                maxDistance={4}
                eyeColor="white"
                pupilColor="#2D2D2D"
                isBlinking={isBlackBlinking}
                forceLookX={
                  password.length > 0 && showPassword
                    ? -4
                    : isLookingAtEachOther
                      ? 0
                      : undefined
                }
                forceLookY={
                  password.length > 0 && showPassword
                    ? -4
                    : isLookingAtEachOther
                      ? -4
                      : undefined
                }
              />
            </div>
          </div>

          {/* Orange semi-circle character */}
          <div
            ref={orangeRef}
            className="character orange-character"
            style={{
              left: '0px',
              width: '240px',
              height: '200px',
              transform:
                password.length > 0 && showPassword
                  ? `skewX(0deg)`
                  : `skewX(${orangePos.bodySkew || 0}deg)`,
            }}
          >
            <div
              className="eyes"
              style={{
                left:
                  password.length > 0 && showPassword
                    ? `${50}px`
                    : `${82 + (orangePos.faceX || 0)}px`,
                top:
                  password.length > 0 && showPassword
                    ? `${85}px`
                    : `${90 + (orangePos.faceY || 0)}px`,
              }}
            >
              <Pupil
                size={12}
                maxDistance={5}
                pupilColor="#2D2D2D"
                forceLookX={password.length > 0 && showPassword ? -5 : undefined}
                forceLookY={password.length > 0 && showPassword ? -4 : undefined}
              />
              <Pupil
                size={12}
                maxDistance={5}
                pupilColor="#2D2D2D"
                forceLookX={password.length > 0 && showPassword ? -5 : undefined}
                forceLookY={password.length > 0 && showPassword ? -4 : undefined}
              />
            </div>
          </div>

          {/* Yellow tall rectangle character */}
          <div
            ref={yellowRef}
            className="character yellow-character"
            style={{
              left: '310px',
              width: '140px',
              height: '230px',
              transform:
                password.length > 0 && showPassword
                  ? `skewX(0deg)`
                  : `skewX(${yellowPos.bodySkew || 0}deg)`,
            }}
          >
            <div
              className="eyes"
              style={{
                left:
                  password.length > 0 && showPassword
                    ? `${20}px`
                    : `${52 + (yellowPos.faceX || 0)}px`,
                top:
                  password.length > 0 && showPassword
                    ? `${35}px`
                    : `${40 + (yellowPos.faceY || 0)}px`,
              }}
            >
              <Pupil
                size={12}
                maxDistance={5}
                pupilColor="#2D2D2D"
                forceLookX={password.length > 0 && showPassword ? -5 : undefined}
                forceLookY={password.length > 0 && showPassword ? -4 : undefined}
              />
              <Pupil
                size={12}
                maxDistance={5}
                pupilColor="#2D2D2D"
                forceLookX={password.length > 0 && showPassword ? -5 : undefined}
                forceLookY={password.length > 0 && showPassword ? -4 : undefined}
              />
            </div>
            <div
              className="mouth"
              style={{
                left:
                  password.length > 0 && showPassword
                    ? `${10}px`
                    : `${40 + (yellowPos.faceX || 0)}px`,
                top:
                  password.length > 0 && showPassword
                    ? `${88}px`
                    : `${88 + (yellowPos.faceY || 0)}px`,
              }}
            />
          </div>
        </div>

        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact</a>
        </div>
      </div>

      {/* Right Login Section */}
      <div className="right-section">
        <div className="login-form-container">
          <div className="mobile-logo">
            <div className="logo-icon">
              <Sparkles size={16} />
            </div>
            <span>Fleet Manager</span>
          </div>

          <div className="header">
            <h1>Welcome back!</h1>
            <p>Please enter your details</p>
          </div>

          <CForm onSubmit={handleSubmit}>
            <div className="mb-3">
              <CFormLabel htmlFor="email">Email</CFormLabel>
              <CFormInput
                type="email"
                id="email"
                placeholder="erik@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
                required
              />
            </div>

            <div className="mb-3">
              <CFormLabel htmlFor="password">Password</CFormLabel>
              <div className="password-wrapper">
                <CFormInput
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <CFormCheck id="remember" label="Remember for 30 days" />
              <a href="#" className="forgot-password">
                Forgot password?
              </a>
            </div>

            {error && <div className="error-message">{error}</div>}

            <CButton type="submit" color="primary" className="w-100 mb-3" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Log in'}
            </CButton>
          </CForm>

          <CButton color="light" className="w-100 google-btn">
            <Mail size={20} className="me-2" />
            Log in with Google
          </CButton>

          <div className="signup-link">
            Don&apos;t have an account? <a href="#/register">Sign Up</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnimatedLogin
