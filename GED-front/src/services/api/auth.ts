import { api } from '../../config/api'
import { ApiResponse } from '../../types/api'
import { User, LoginRequest, AuthResponse } from '../../types/auth'

export const authApi = {
  login: async (credentials: LoginRequest) => {
    // The backend traceback confirms use of OAuth2PasswordRequestForm
    // which MUST be application/x-www-form-urlencoded with 'username' and 'password'.
    const params = new URLSearchParams()
    params.append('username', credentials.email)
    params.append('password', credentials.password)

    const response = await api.post<any>('/auth/login', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    
    // Check if the response follows the ApiResponse wrapper or raw OAuth2 format
    const data = response.data.data || response.data
    const { access_token, refresh_token, user } = data
    
    if (access_token) {
      localStorage.setItem('access_token', access_token)
      if (refresh_token) localStorage.setItem('refresh_token', refresh_token)
      return data
    }
    
    throw new Error('Authentication response missing access token.')
  },

  logout: async () => {
    try {
      await api.post('/auth/logout')
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/login'
    }
  },

  getMe: async () => {
    const response = await api.get<any>('/auth/me')
    return response.data.data || response.data
  }
}
