import { Routes, Route, Navigate } from 'react-router'
import { LoginPage } from './LoginPage'
import { RegisterPage } from './RegisterPage'
import { useAuthState } from '../../hooks/auth'
import { Spinner, VStack } from '@chakra-ui/react'

export function AuthRoutes() {
  const { data: authState, isPending } = useAuthState()

  // Show loading spinner while checking auth state
  if (isPending) {
    return (
      <VStack minH="100vh" justify="center" align="center">
        <Spinner size="xl" color="blue.500" />
      </VStack>
    )
  }

  // Redirect to app if already authenticated
  if (authState?.isAuthenticated) {
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
