import { useMutation } from '@tanstack/react-query'
import type { User, UserLogin, UserRegistration } from '@weave/types'

// API 调用函数
const API_BASE_URL = 'http://localhost:3001/api'

async function registerUser(userData: UserRegistration): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to register user')
  }

  return response.json()
}

async function loginUser(credentials: UserLogin): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to login user')
  }

  return response.json()
}

// React Query hooks
export function useRegister() {
  return useMutation({
    mutationFn: registerUser,
  })
}

export function useLogin() {
  return useMutation({
    mutationFn: loginUser,
  })
}