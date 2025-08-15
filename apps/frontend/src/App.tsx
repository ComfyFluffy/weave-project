import { Routes, Route, Navigate } from 'react-router'
import { QueryProvider } from './providers/QueryProvider'
import { AuthProvider, useAuth } from './providers/AuthProvider'
import { AuthRoutes } from './pages/auth/AuthRoutes'
import { ChatLayout } from './components/ChatLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import './App.css'

function AppContent() {
  return (
    <Routes>
      <Route path="/app/*" element={<ChatLayout />} />
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
