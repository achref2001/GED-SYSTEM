import axios, { AxiosError } from 'axios'

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8008/api/v1'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: { 'Accept': 'application/json' }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as any
    
    // Check if error is 401 and hasn't been retried yet
    if (error.response?.status === 401 && !original._retry && !original.url?.includes('/auth/login')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          original.headers.Authorization = `Bearer ${token}`
          return api(original)
        })
      }
      
      original._retry = true
      isRefreshing = true
      
      try {
        const refresh = localStorage.getItem('refresh_token')
        if (!refresh) throw new Error('No refresh token')
        
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refresh_token: refresh }
        )
        
        const newToken = data.data.access_token
        localStorage.setItem('access_token', newToken)
        
        failedQueue.forEach(p => p.resolve(newToken))
        failedQueue = []
        
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch (e) {
        failedQueue.forEach(p => p.reject(e))
        failedQueue = []
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(e)
      } finally {
        isRefreshing = false
      }
    }
    
    return Promise.reject(error)
  }
)
