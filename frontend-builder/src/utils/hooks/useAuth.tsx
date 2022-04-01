import { FetchResult } from '@apollo/client'
import React, {
  useState,
  useEffect,
  PropsWithChildren,
  useContext,
  createContext,
} from 'react'
import { client } from '../../apolloClient'
import {
  MeDocument,
  useMeQuery,
  useLoginMutation,
  useLogoutMutation,
  useChangePasswordMutation,
  ChangePasswordMutation,
  useResetPasswordMutation,
  useForgotPasswordMutation,
  ForgotPasswordMutation,
  ResetPasswordMutation,
} from '../../generated/graphql'

interface IAuthContext {
  login: (usrename: string, password: string) => void
  logout: () => void
  logoutLoading: boolean
  forgotPassword: (
    email: string
  ) => Promise<FetchResult<ForgotPasswordMutation>>
  resetPassword: (
    token: string,
    newPassword: string
  ) => Promise<FetchResult<ResetPasswordMutation>>
  changePassword: (
    email: string,
    currentPassword: string,
    newPassword: string
  ) => Promise<FetchResult<ChangePasswordMutation>>
  loginFailed: boolean
  loginLoading: boolean
  isLoggedIn?: boolean
}

export const AuthContext = createContext<IAuthContext>({
  login: () => null,
  logout: () => null,
  logoutLoading: false,
  forgotPassword: email => new Promise(r => true),
  resetPassword: (token, newPassword) => new Promise(r => true),
  changePassword: (email, currentPassword, newPassword) =>
    new Promise(r => true),
  loginFailed: false,
  loginLoading: false,
  isLoggedIn: false,
})

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>()
  const [loginFailed, setLoginFailed] = useState<boolean>(false)
  const [loginLoading, setLoginLoading] = useState<boolean>(false)
  const { loading, data, error } = useMeQuery()

  const [loginMutation, { data: loginData }] = useLoginMutation({
    refetchQueries: [
      {
        query: MeDocument,
      },
    ],
  })
  const [logoutMutation, { loading: logoutLoading }] = useLogoutMutation({
    refetchQueries: [
      {
        query: MeDocument,
      },
    ],
  })

  const [resetPasswordMutation] = useResetPasswordMutation()
  const [forgotPasswordMutation] = useForgotPasswordMutation()
  const [changePasswordMutation] = useChangePasswordMutation()

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

  const changePassword = async (oldPassword: string, newPassword: string) => {
    return changePasswordMutation({
      variables: {
        oldPassword,
        newPassword,
      },
    })
  }

  const logout = () => {
    logoutMutation()
    client.clearStore()
    setIsLoggedIn(false)
  }

  const login = async (email: string, password: string) => {
    setIsLoggedIn(undefined)
    setLoginLoading(true)
    setLoginFailed(false)
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
    setLoginLoading(false)
  }

  useEffect(() => {
    if (loginData) {
      window.localStorage.setItem('wsToken', `${loginData.login}`)
    }
  }, [loginData])

  useEffect(() => {
    debugger
    if (data) {
      setIsLoggedIn(!!data.me)
    }
    if (error) {
      setIsLoggedIn(false)
    }
  }, [loading, data, error])
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        logout,
        logoutLoading,
        login,
        loginFailed,
        loginLoading,
        forgotPassword,
        resetPassword,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
