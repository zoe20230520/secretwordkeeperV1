"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface User {
  id: string
  username: string
  email?: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => boolean
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEFAULT_ADMIN = {
  username: "admin",
  password: "admin123",
  id: "admin-001",
  email: "admin@example.com",
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth")
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth)
        setUser(authData.user)
      } catch (error) {
        console.error("Failed to parse stored auth:", error)
        localStorage.removeItem("auth")
      }
    }
  }, [])

  const login = (username: string, password: string): boolean => {
    if (username === DEFAULT_ADMIN.username && password === DEFAULT_ADMIN.password) {
      const userData = {
        id: DEFAULT_ADMIN.id,
        username: DEFAULT_ADMIN.username,
        email: DEFAULT_ADMIN.email,
      }
      setUser(userData)
      localStorage.setItem("auth", JSON.stringify({ user: userData }))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
