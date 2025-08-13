import { Routes, Route, Navigate } from 'react-router'
import { QueryProvider } from './providers/QueryProvider'
import { AuthProvider, useAuth } from './providers/AuthProvider'
import { AuthRoutes } from './pages/auth/AuthRoutes'
import { ChatLayout } from './components/ChatLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import './App.css'

function AppContent() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route path="/auth/*" element={<AuthRoutes />} />
      <Route
        path="/app/*"
        element={
            <ChatLayout />
        }
      />
      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? '/app' : '/auth/login'} replace />
        }
      />
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
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
