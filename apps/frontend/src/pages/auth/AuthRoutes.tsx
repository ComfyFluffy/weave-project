import { Routes, Route, Navigate } from 'react-router'
import { useAuth } from '../../providers/AuthProvider'
import { LoginPage } from './LoginPage'
import { RegisterPage } from './RegisterPage'

export function AuthRoutes() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/app" replace />
  }

  return (
    <Routes>
      <Route index element={<LoginPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  )
}
