import React, { createContext, useContext, useEffect } from 'react'
import { useAuthState } from '../hooks/auth'

const AuthContext = createContext<{
  isAuthenticated: boolean
  isLoading: boolean
}>({
  isAuthenticated: false,
  isLoading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: authState, isPending } = useAuthState()

  // Handle socket authentication when auth state changes
  useEffect(() => {
    async function updateSocketAuth() {
      if (!isPending) {
        // Import socket service inside effect to avoid circular dependency
        const { socketService } = await import('../services/socket')
        
        if (authState?.isAuthenticated) {
          // User is authenticated, ensure socket is connected with auth
          socketService.updateAuth()
        } else {
          // User is not authenticated, disconnect socket
          socketService.socket.disconnect()
        }
      }
    }
    
    void updateSocketAuth()
  }, [authState?.isAuthenticated, isPending])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState?.isAuthenticated ?? false,
        isLoading: isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
