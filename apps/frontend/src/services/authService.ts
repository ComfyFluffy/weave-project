import type { User, UserLogin, UserRegistration } from '@weave/types'

const API_BASE_URL = 'http://localhost:3001/api'

class AuthService {
  async register(userData: UserRegistration): Promise<User> {
    console.log('AuthService: Registering user with data:', userData)
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    console.log('AuthService: Register response:', response)

    if (!response.ok) {
      const error = await response.json()
      console.error('AuthService: Registration failed with error:', error)
      throw new Error(error.error || 'Failed to register user')
    }

    const user = await response.json()
    console.log('AuthService: Registration successful, user:', user)
    return user
  }

  async login(credentials: UserLogin): Promise<User> {
    console.log('AuthService: Logging in with credentials:', credentials)
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })
    console.log('AuthService: Login response:', response)

    if (!response.ok) {
      const error = await response.json()
      console.error('AuthService: Login failed with error:', error)
      throw new Error(error.error || 'Failed to login user')
    }

    const user = await response.json()
    console.log('AuthService: Login successful, user:', user)
    return user
  }
}

export const authService = new AuthService()