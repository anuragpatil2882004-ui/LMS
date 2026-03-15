import { create } from 'zustand'
import api from '../lib/api'

const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  authReady: false,

  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password })
    return response.data
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    const { accessToken, user } = response.data
    set({ user, accessToken })
    localStorage.setItem('accessToken', accessToken)
    return response.data
  },

  logout: async () => {
    try { await api.post('/auth/logout') } catch (e) {}
    set({ user: null, accessToken: null })
    localStorage.removeItem('accessToken')
  },

  refreshAccessToken: async () => {
    try {
      const response = await api.post('/auth/refresh')
      const { accessToken } = response.data
      set({ accessToken })
      localStorage.setItem('accessToken', accessToken)
      return accessToken
    } catch (error) {
      get().logout()
      throw error
    }
  },

  initializeAuth: async () => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      try {
        const response = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
        set({ user: response.data, accessToken, authReady: true })
      } catch (e) {
        localStorage.removeItem('accessToken')
        set({ user: null, accessToken: null, authReady: true })
      }
    } else {
      set({ authReady: true })
    }
  }
}))

export { useAuthStore }