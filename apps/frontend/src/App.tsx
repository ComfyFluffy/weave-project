import { Routes, Route, Navigate } from 'react-router-dom'
import { ChatLayout } from './components/ChatLayout'
import { QueryProvider } from './providers/QueryProvider'
import { AuthProvider, useAuth } from './providers/AuthProvider'
import { AuthRoutes } from './components/auth/AuthRoutes'
import './App.css'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route path="/auth/*" element={<AuthRoutes />} />
      <Route
        path="/app/*"
        element={
          <ProtectedRoute>
            <ChatLayout />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to={isAuthenticated ? "/app" : "/auth/login"} replace />} />
    </Routes>
  )
}

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryProvider>
  )
}

export default App
