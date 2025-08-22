import { Navigate, useLocation } from 'react-router'
import { useAuthState } from '../hooks/auth'
import { Spinner, VStack } from '@chakra-ui/react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation()
  const { data: authState, isPending } = useAuthState()

  // Show loading spinner while checking auth state
  if (isPending) {
    return (
      <VStack minH="100vh" justify="center" align="center">
        <Spinner size="xl" color="blue.500" />
      </VStack>
    )
  }

  // Redirect to login if not authenticated
  if (!authState?.isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  // Render protected content if authenticated
  return <>{children}</>
}
