import React, { useState } from 'react'
import { useLoginMutation } from '../../generated/graphql'
import { useNavigate } from 'react-router-dom'

const Login: React.FC = function Login() {
  const [login] = useLoginMutation()
  let navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  return (
    <div>
      <h1>Login</h1>
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
          const response = await login({
            variables: {
              email,
              password,
            },
          })
          if (response.data?.login.sessionId) {
            navigate('/database-editor')
          }
        }}
      >
        Login!
      </button>
    </div>
  )
}

export default Login
