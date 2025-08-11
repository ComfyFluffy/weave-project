import { Routes, Route, Navigate } from 'react-router'
import { LoginPage } from './LoginPage'
import { RegisterPage } from './RegisterPage'

export function AuthRoutes() {
  return (
    <Routes>
      <Route index element={<LoginPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  )
}
