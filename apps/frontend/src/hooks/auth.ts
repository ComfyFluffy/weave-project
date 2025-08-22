import { useQuery, useQueryClient } from '@tanstack/react-query'
import { tsr } from '../services/tsr'

interface AuthState {
  token: string | null
  isAuthenticated: boolean
}

// Auth storage helpers
const TOKEN_KEY = 'weave_auth_token'

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export function getAuthState(): AuthState {
  const token = getStoredToken()
  return {
    token,
    isAuthenticated: !!token,
  }
}

// Login hook
export function useLogin() {
  const queryClient = useQueryClient()

  return tsr.auth.login.useMutation({
    onSuccess: (data) => {
      setStoredToken(data.body.token)
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
