import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../utils/hooks/useAuth'

export function PrivateRoute() {
  const { isLoggedIn } = useAuth()
  return isLoggedIn === false ? <Navigate to="/login" /> : <Outlet />
}
