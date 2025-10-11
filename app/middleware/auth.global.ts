export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return

  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    authStore.loadFromLocalStorage()
  }

  const publicRoutes = ['/login', '/register', '/forgot-password']
  const isPublicRoute = publicRoutes.some(route => to.path.startsWith(route))

  if (!authStore.isAuthenticated) {
    if (!isPublicRoute) {
      return navigateTo('/login')
    }
    return
  }

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
      console.error('Token tekshirish xatosi:', error)
      authStore.clearAuth()
      return navigateTo('/login')
    }
  }

  if (isPublicRoute && authStore.isAuthenticated) {
    return navigateTo('/')
  }
})