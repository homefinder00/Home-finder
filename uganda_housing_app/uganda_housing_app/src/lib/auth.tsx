import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { getCurrentUser, logout as apiLogout, getUser, isAuthenticated, attemptAutoLogin } from '@/lib/api'

interface User {
  id: number
  name: string
  email: string
  phone?: string
  user_type: 'tenant' | 'landlord'
  email_verified_at?: string
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isLoggedIn: boolean
  login: (user: User) => void
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isLoggedIn = !!user && isAuthenticated()

  const login = (userData: User) => {
    setUser(userData)
    // Ensure user data is persisted to localStorage for navigation
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = async () => {
    try {
      await apiLogout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      // Clear saved credentials when user manually logs out
      const { clearSavedCredentials } = await import('@/lib/api')
      clearSavedCredentials()
    }
  }

  const refreshUser = async () => {
    if (!isAuthenticated()) {
      setUser(null)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Error refreshing user:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Initialize user on mount
  useEffect(() => {
    const initializeAuth = async () => {
      // First check if we have a stored user and token
      const storedUser = getUser()
      if (storedUser && isAuthenticated()) {
        setUser(storedUser)
        // Verify the token is still valid by refreshing user data
        await refreshUser()
      } else {
        // Try auto-login with saved credentials
        const autoLoginSuccess = await attemptAutoLogin()
        if (!autoLoginSuccess) {
          setIsLoading(false)
        }
        // If auto-login succeeds, the user state will be updated by the login function
      }
    }

    initializeAuth()
  }, [])

  // Set up token refresh interval (optional)
  useEffect(() => {
    if (isLoggedIn) {
      // Refresh user data every 30 minutes to keep session alive
      const interval = setInterval(refreshUser, 30 * 60 * 1000)
      return () => clearInterval(interval)
    }
  }, [isLoggedIn])

  const value: AuthContextType = {
    user,
    isLoading,
    isLoggedIn,
    login,
    logout,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Helper hooks for common use cases
export function useUser() {
  const { user } = useAuth()
  return user
}

export function useIsLoggedIn() {
  const { isLoggedIn } = useAuth()
  return isLoggedIn
}

export function useIsLandlord() {
  const { user } = useAuth()
  return user?.user_type === 'landlord'
}

export function useIsTenant() {
  const { user } = useAuth()
  return user?.user_type === 'tenant'
}
