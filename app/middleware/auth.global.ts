export default defineNuxtRouteMiddleware((to) => {
    const accessToken = useCookie('at').value
  
    const publicRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password']
  
    const isPublicRoute = publicRoutes.includes(to.path)
  
    if (!accessToken && !isPublicRoute) {
      return navigateTo('/auth/login')
    }
  
    if (accessToken && to.path === '/auth/login') {
      return navigateTo('/')
    }
  })
  