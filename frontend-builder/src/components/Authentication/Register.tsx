import React, { useState } from 'react'
import { useRegisterMutation } from '../../generated/graphql'
import { useNavigate } from 'react-router-dom'

const Login: React.FC = function Login() {
  const [register] = useRegisterMutation()
  let navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  return (
    <div>
      <h1>Register</h1>
      <input
        type="text"
        value={email}
        onChange={e => {
          const newEmail = e.currentTarget.value
          setEmail(newEmail)
        }}
      />
      <input
        type="password"
        value={password}
        onChange={e => {
          const newPassword = e.currentTarget.value
          setPassword(newPassword)
        }}
      />
      <button
        onClick={async () => {
          const response = await register({
            variables: {
              email,
              password,
            },
          })
          if (response.data?.register.user) {
            navigate('/database-editor')
          }
        }}
      >
        Register!
      </button>
    </div>
  )
}

export default Login
