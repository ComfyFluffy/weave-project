import { useQuery, useQueryClient } from '@tanstack/react-query'
import { tsr } from '../services/tsr'
import {
  setStoredToken,
  removeStoredToken,
  getAuthState,
} from '../utils/auth-storage'
import { socketService } from '../services/socket'

// Auth storage helpers are now imported from utils/auth-storage.ts
// This prevents circular dependencies with socket service

// Re-export auth storage functions for backward compatibility
export {
  getStoredToken,
  setStoredToken,
  removeStoredToken,
  getAuthState,
} from '../utils/auth-storage'
export type { AuthState } from '../utils/auth-storage'

// Login hook
export function useLogin() {
  const queryClient = useQueryClient()

  return tsr.auth.login.useMutation({
    onSuccess: (data) => {
      setStoredToken(data.body.token)
      // Update socket authentication (import inside function to avoid circular dependency)
      socketService.updateAuth()
      // Invalidate and refetch any queries that depend on auth
      void queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
  })
}

// Register hook
export function useRegister() {
  const queryClient = useQueryClient()

  return tsr.auth.register.useMutation({
    onSuccess: (data) => {
      setStoredToken(data.body.token)
      // Update socket authentication (import inside function to avoid circular dependency)
      socketService.updateAuth()
      // Invalidate and refetch any queries that depend on auth
      void queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
  })
}

// Logout hook
export function useLogout() {
  const queryClient = useQueryClient()

  return {
    logout: () => {
      removeStoredToken()
      // Disconnect socket when logging out (import inside function to avoid circular dependency)
      socketService.socket.disconnect()
      // Invalidate and refetch any queries that may depend on auth
      void queryClient.clear()
    },
  }
}

// Auth state hook
export function useAuthState() {
  return useQuery({
    queryKey: ['auth'],
    queryFn: () => getAuthState(),
    staleTime: Infinity, // Auth state shouldn't become stale
  })
}

// Current user hook
export function useCurrentUser() {
  return tsr.user.getCurrentUser.useQuery({
    queryKey: ['currentUser'],
  })
}
