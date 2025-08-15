import { Navigate } from 'react-router'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const useAuth = () => {
  throw new Error('TODO: Implement useAuth')
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  return <>{children}</>
}
