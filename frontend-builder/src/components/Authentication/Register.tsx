import React, { useState } from 'react'
import { useRegisterMutation } from '../../generated/graphql'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Button } from '../Shared/primitives/Button'
import {
  InputAdornment,
  IconButton,
  CircularProgress,
  Link,
} from '@mui/material'
import {
  WelcomeText,
  AlertBar,
  LoginTextField,
  LoginBoxFooter,
} from './LoginStyles'
import { isEmail } from '../../utils/validation'
import styles from './Authentication.module.css'

const Register: React.FC = function Register() {
  const [register] = useRegisterMutation()
  let navigate = useNavigate()
  const [error, setError] = useState(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState(false)
  const [showLoading, setShowLoading] = useState<boolean>(false)
  const [emailError, setEmailError] = useState<boolean>(false)
  const [passwordError, setPasswordError] = useState<boolean>(false)

  const handleClick = async (e: React.FormEvent) => {
    e.preventDefault()
    setShowLoading(true)
    setEmailError(false)
    setPasswordError(false)

    let hasErrors = false
    if (!email || !isEmail(email)) {
      setEmailError(true)
      hasErrors = true
    }
    if (!password) {
      setPasswordError(true)
      hasErrors = true
    }

    if (email && password && !hasErrors) {
      try {
        await register({
          variables: {
            email,
            password,
          },
        })
        navigate('/dashboard')
      } catch (err) {
        console.log('Login Error', err)
        setError(true)
      } finally {
        setShowLoading(true)
      }
    }
    setShowLoading(false)
  }
  return (
    <form name="LoginForm" onSubmit={handleClick}>
      <div className={styles['login-container']}>
        <div className={styles['login-box']}>
          <WelcomeText>Register</WelcomeText>
          {error && (
            <AlertBar type="error" message="Invalid email or password" />
          )}

          <LoginTextField
            id="username"
            label="Email"
            value={email}
            error={emailError}
            helperText={emailError && 'You must enter a valid email address.'}
            onChange={e => {
              const newEmail = e.target.value.trim().toLowerCase()
              setEmail(newEmail)
            }}
            autoFocus={true}
            required={true}
          />
          <LoginTextField
            label="Password"
            required={true}
            onChange={e => {
              setPassword(e.target.value)
            }}
            error={passwordError}
            helperText={passwordError && 'You must enter a password.'}
            value={password}
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={e => setShowPassword(p => !p)}
                    onMouseDown={e => e.preventDefault()}
                  >
                    {showPassword ? (
                      <Visibility htmlColor="#AEAEAE" />
                    ) : (
                      <VisibilityOff htmlColor="#2E2E2E" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <div
            style={{
              position: 'relative',
              margin: '4em 0',
              textAlign: 'center',
            }}
          >
            <Button disabled={showLoading} type="submit" color="primary">
              {showLoading && (
                <CircularProgress
                  size={12}
                  color="secondary"
                  style={{ marginRight: '10px' }}
                />
              )}
              <span>Register</span>
            </Button>
          </div>
          <LoginBoxFooter>
            <Link
              component={RouterLink}
              to="/login"
              style={{ color: '#AEAEAE' }}
            >
              Login
            </Link>
          </LoginBoxFooter>
        </div>
      </div>
    </form>
  )
}

export default Register
