/**
 * SSR-specific auth middleware
 * Bu middleware faqat server-side'da ishlaydi
 * Client-side'da token tekshirish va redirect mavjud
 */
export default defineNuxtRouteMiddleware(async (to) => {
  // Server-side auth check
  if (process.server) {
    const authStore = useAuthStore()
    
    // Public routelar
    const publicRoutes = ['/login', '/register', '/forgot-password']
    const isPublicRoute = publicRoutes.some(route => to.path.startsWith(route))

    // Agar public route bo'lsa, ruxsat berish
    if (isPublicRoute) {
      return
    }

    // Server-side'da token tekshirish
    if (!authStore.isAuthenticated || !authStore.accessToken) {
      // SSR'da redirect
      return navigateTo('/login')
    }

    // Token validation (server-side)
    try {
      const tokenParts = authStore.accessToken.split('.')
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]))
        const currentTime = Math.floor(Date.now() / 1000)

        // Token muddati tugagan bo'lsa
        if (payload.exp && payload.exp < currentTime) {
          // Server-side'da refresh qilish
          const refreshed = await authStore.refreshAccessToken()
          
          if (!refreshed) {
            authStore.clearAuth()
            return navigateTo('/login')
          }
        }
      }
    } catch (error) {
      console.error('Server-side token validation xatosi:', error)
      authStore.clearAuth()
      return navigateTo('/login')
    }
  }

  // Client-side auth check
  if (process.client) {
    const authStore = useAuthStore()

    // LocalStorage'dan ma'lumotlarni yuklash
    if (!authStore.isAuthenticated) {
      authStore.loadFromLocalStorage()
    }

    // Public routelar
    const publicRoutes = ['/login', '/register', '/forgot-password']
    const isPublicRoute = publicRoutes.some(route => to.path.startsWith(route))

    // Agar foydalanuvchi autentifikatsiya qilinmagan bo'lsa
    if (!authStore.isAuthenticated) {
      if (!isPublicRoute) {
        return navigateTo('/login')
      }
      return
    }

    // Client-side token expiry check
    if (authStore.accessToken) {
      try {
        const tokenParts = authStore.accessToken.split('.')
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]))
          const currentTime = Math.floor(Date.now() / 1000)
          const bufferTime = 60

          if (payload.exp && payload.exp - currentTime < bufferTime) {
            const refreshed = await authStore.refreshAccessToken()
            
            if (!refreshed) {
              authStore.clearAuth()
              return navigateTo('/login')
            }
          }
        }
      } catch (error) {
        console.error('Client-side token tekshirish xatosi:', error)
        authStore.clearAuth()
        return navigateTo('/login')
      }
    }

    // Agar authenticated va public route'ga kirmoqchi bo'lsa
    if (isPublicRoute && authStore.isAuthenticated) {
      return navigateTo('/')
    }
  }
})