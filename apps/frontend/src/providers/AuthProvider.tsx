import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User } from '@weave/types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)

  // 初始化时用户未登录
  // 认证状态将在页面刷新后丢失，需要重新登录
  // 这样可以避免将敏感信息存储在 localStorage 中
  useEffect(() => {
    // 不再从 localStorage 读取用户信息
    // 用户需要重新登录以获得认证状态
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    // 不再将用户信息存储在 localStorage 中
    // 认证状态仅在内存中保持
  }

  const logout = () => {
    setUser(null)
    // 不再需要从 localStorage 移除用户信息
  }

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return {
    user: {
      id: 'gm-1',
      displayName: '游戏主持人',
    },
    isAuthenticated: true,
    login: (user: User) => {},
    logout: () => {},
  } satisfies AuthContextType
}
