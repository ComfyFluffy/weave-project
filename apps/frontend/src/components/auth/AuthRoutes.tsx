import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../../providers/AuthProvider'
import { LoginRoute } from './LoginRoute'
import { RegisterRoute } from './RegisterRoute'

export function AuthRoutes() {
  const { isAuthenticated } = useAuth()
  
  if (isAuthenticated) {
    return <Navigate to="/app" replace />
  }
  
  return (
    <Routes>
      <Route index element={<LoginRoute />} />
      <Route path="login" element={<LoginRoute />} />
      <Route path="register" element={<RegisterRoute />} />
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  )
}