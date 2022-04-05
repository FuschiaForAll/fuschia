import {
  FetchResult,
  gql,
  useApolloClient,
  useMutation,
  useQuery,
} from '@apollo/client'
import { useContext, createContext, useEffect, useState } from 'react'

const LOGGED_IN = gql`
  query loggedIn {
    isLoggedIn
  }
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`

const LOGOUT = gql`
  mutation LOGOUT {
    logout
  }
`

const RESET_PASSWORD = gql`
  mutation PasswordReset($token: String!, $newPassword: String!) {
    passwordReset(token: $token, newPassword: $newPassword)
  }
`

const FORGOT_PASSWORD = gql`
  mutation SendResetPassword($email: String!) {
    sendPasswordReset(email: $email)
  }
`

interface IAuthContext {
  login: (email: string, password: string) => Promise<FetchResult<string>>
  logout: () => void
  forgotPassword: (email: string) => Promise<FetchResult<Boolean>>
  resetPassword: (
    token: string,
    newPassword: string
  ) => Promise<FetchResult<{ passwordReset: boolean }>>
  loginFailed: boolean
  isLoggedIn?: boolean
}

export const AuthContext = createContext<IAuthContext>({
  login: () => new Promise(r => ''),
  logout: () => null,
  forgotPassword: email => new Promise(r => true),
  resetPassword: (token, newPassword) => new Promise(r => true),
  loginFailed: false,
  isLoggedIn: false,
})

export const AuthProvider: React.FC = ({ children }) => {
  const client = useApolloClient()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>()
  const [loginFailed, setLoginFailed] = useState<boolean>(false)
  const { loading, data, error } = useQuery(LOGGED_IN)
  const [loginMutation] = useMutation(LOGIN_MUTATION, {
    refetchQueries: [
      {
        query: LOGGED_IN,
      },
    ],
  })
  const [logoutMutation] = useMutation(LOGOUT, {
    refetchQueries: [
      {
        query: LOGGED_IN,
      },
    ],
  })

  const [resetPasswordMutation] = useMutation(RESET_PASSWORD)
  const [forgotPasswordMutation] = useMutation(FORGOT_PASSWORD)

  const forgotPassword = async (email: string) => {
    return forgotPasswordMutation({ variables: { email } })
  }

  const resetPassword = async (token: string, newPassword: string) => {
    return resetPasswordMutation({
      variables: {
        token,
        newPassword,
      },
    })
  }

  const logout = () => {
    logoutMutation()
    client.resetStore()
    setIsLoggedIn(false)
  }

  const login = async (email: string, password: string) => {
    const results = await loginMutation({
      variables: { email: email, password: password },
    })
    if (results.data && results.data.login) {
      setIsLoggedIn(true)
      setLoginFailed(false)
    } else {
      setLoginFailed(true)
      setIsLoggedIn(false)
    }
    return results
  }

  useEffect(() => {
    if (data) {
      setIsLoggedIn(data.isLoggedIn)
    }
  }, [loading, data, error])
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        logout,
        login,
        loginFailed,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
