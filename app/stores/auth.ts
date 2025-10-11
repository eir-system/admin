import { defineStore } from 'pinia'
import type { User, LoginCredentials, AuthResponse } from '~/types'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  loading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    loading: false
  }),

  getters: {
    getUser: (state): User | null => state.user,
    isLoggedIn: (state): boolean => state.isAuthenticated,
    getUserRole: (state): string | undefined => state.user?.role,
    getAccessToken: (state): string | null => state.accessToken
  },

  actions: {
    /**
     * Login qilish (Server-side only)
     */
    async login(credentials: LoginCredentials): Promise<void> {
      this.loading = true
      try {
        // Server-side request - browser networkda ko'rinmaydi
        const { data } = await useServerApiPost<AuthResponse>('/api/auth/login', credentials)

        if (data.value) {
          this.setAuth(data.value)
        }
      } catch (error) {
        console.error('Login xatosi:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Logout qilish (Server-side only)
     */
    async logout(): Promise<void> {
      try {
        // Server-side request
        await useServerApiPost('/api/auth/logout', {}, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        })
      } catch (error) {
        console.error('Logout xatosi:', error)
      } finally {
        this.clearAuth()
        navigateTo('/login')
      }
    },

    /**
     * Token yangilash (Server-side only)
     */
    async refreshAccessToken(): Promise<boolean> {
      if (!this.refreshToken) {
        return false
      }

      try {
        // Server-side request - browser networkda ko'rinmaydi
        const { data } = await useServerApiPost<AuthResponse>('/api/auth/refresh', {
          refreshToken: this.refreshToken
        })

        if (data.value) {
          this.accessToken = data.value.accessToken
          if (data.value.refreshToken) {
            this.refreshToken = data.value.refreshToken
          }
          this.saveToLocalStorage()
          return true
        }
        return false
      } catch (error) {
        console.error('Token yangilash xatosi:', error)
        this.clearAuth()
        return false
      }
    },

    /**
     * Foydalanuvchi ma'lumotlarini o'rnatish
     */
    setAuth(authData: AuthResponse): void {
      this.user = authData.user
      this.accessToken = authData.accessToken
      this.refreshToken = authData.refreshToken
      this.isAuthenticated = true
      this.saveToLocalStorage()
    },

    /**
     * Auth ma'lumotlarini tozalash
     */
    clearAuth(): void {
      this.user = null
      this.accessToken = null
      this.refreshToken = null
      this.isAuthenticated = false
      this.clearLocalStorage()
    },

    /**
     * LocalStorage'ga saqlash
     */
    saveToLocalStorage(): void {
      if (process.client) {
        localStorage.setItem('auth', JSON.stringify({
          user: this.user,
          accessToken: this.accessToken,
          refreshToken: this.refreshToken
        }))
      }
    },

    /**
     * LocalStorage'dan yuklash
     */
    loadFromLocalStorage(): void {
      if (process.client) {
        const authData = localStorage.getItem('auth')
        if (authData) {
          try {
            const parsed = JSON.parse(authData)
            this.user = parsed.user
            this.accessToken = parsed.accessToken
            this.refreshToken = parsed.refreshToken
            this.isAuthenticated = !!parsed.user
          } catch (error) {
            console.error('Auth ma\'lumotlarini yuklash xatosi:', error)
            this.clearLocalStorage()
          }
        }
      }
    },

    /**
     * LocalStorage'ni tozalash
     */
    clearLocalStorage(): void {
      if (process.client) {
        localStorage.removeItem('auth')
      }
    },

    /**
     * Foydalanuvchi ma'lumotlarini yangilash (Server-side only)
     */
    async fetchUser(): Promise<void> {
      if (!this.accessToken) return

      try {
        // Server-side request
        const { data } = await useServerApiGet<{ user: User }>('/api/auth/session', {
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        })

        if (data.value?.user) {
          this.user = data.value.user
          this.saveToLocalStorage()
        }
      } catch (error) {
        console.error('Foydalanuvchi ma\'lumotlarini yuklash xatosi:', error)
      }
    }
  }
})