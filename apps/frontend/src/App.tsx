import { Routes, Route, Navigate } from 'react-router'
import { QueryProvider } from './providers/QueryProvider'
import { AuthRoutes } from './pages/auth/AuthRoutes'
import { ChatLayout } from './components/ChatLayout'
import './App.css'

function AppContent() {
  return (
    <Routes>
      <Route path="/auth/*" element={<AuthRoutes />} />
      <Route path="/app/*" element={<ChatLayout />} />
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <QueryProvider>
      <AppContent />
    </QueryProvider>
  )
}

export default App
