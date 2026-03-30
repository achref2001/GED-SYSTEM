import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User, Role } from '../types/auth'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  
  setUser: (user: User | null) => void
  login: (user: User, tokens: { accessToken: string; refreshToken?: string }) => void
  logout: () => void
  hasRole: (roles: Role[]) => boolean
  hasAnyRole: (...roles: Role[]) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      login: (user, tokens) => {
        set({ user, isAuthenticated: true })
        localStorage.setItem('access_token', tokens.accessToken)
        if (tokens.refreshToken) localStorage.setItem('refresh_token', tokens.refreshToken)
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false })
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      },
      
      hasRole: (roles) => {
        const user = get().user
        return !!user && roles.includes(user.role)
      },
      
      hasAnyRole: (...roles) => {
        const user = get().user
        return !!user && roles.includes(user.role)
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
