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

export interface AuthState {
  token: string | null
  isAuthenticated: boolean
}

export function getAuthState(): AuthState {
  const token = getStoredToken()
  return {
    token,
    isAuthenticated: !!token,
  }
}
