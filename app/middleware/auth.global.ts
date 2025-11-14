export default defineNuxtRouteMiddleware((to) => {
    const refreshToken = useCookie('rt').value
  
    const publicRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password']
  
    const isPublicRoute = publicRoutes.includes(to.path)
  
    if (!refreshToken && !isPublicRoute) {
      return navigateTo('/auth/login')
    }
  
    if (refreshToken && to.path === '/auth/login') {
      return navigateTo('/')
    }
  })
  