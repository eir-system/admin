import type { UseFetchOptions } from 'nuxt/app'

/**
 * Server-side API client
 * Barcha requestlar server-side'da bajariladi va browser networkda ko'rinmaydi
 */
export const useServerApi = <T>(
  url: string,
  options: UseFetchOptions<T> = {}
) => {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()

  // Default headers
  const defaultHeaders: HeadersInit = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }

  // Bearer token qo'shish
  if (authStore.accessToken) {
    defaultHeaders.Authorization = `Bearer ${authStore.accessToken}`
  }

  // Server-side only options
  const mergedOptions: UseFetchOptions<T> = {
    ...options,
    
    // MUHIM: server=true - faqat server-side'da ishlaydi
    server: true,
    
    // MUHIM: lazy=false - SSR vaqtida to'liq yuklanadi
    lazy: false,
    
    baseURL: config.public.apiBase,
    headers: {
      ...defaultHeaders,
      ...options.headers
    },
    
    // Credentials bilan ishlash (cookies uchun)
    credentials: 'include',
    
    // Error handling
    onResponseError({ response }) {
      // 401 - Unauthorized
      if (response.status === 401) {
        authStore.clearAuth()
        if (process.client) {
          navigateTo('/login')
        }
      }
      
      // 403 - Forbidden
      if (response.status === 403) {
        console.error('Ruxsat berilmagan amal')
      }
      
      // 500 - Server xatosi
      if (response.status === 500) {
        console.error('Server xatosi yuz berdi')
      }
    }
  }

  return useFetch<T>(url, mergedOptions)
}

/**
 * GET request (server-only)
 */
export const useServerApiGet = <T>(url: string, options: UseFetchOptions<T> = {}) => {
  return useServerApi<T>(url, {
    ...options,
    method: 'GET'
  })
}

/**
 * POST request (server-only)
 */
export const useServerApiPost = <T>(
  url: string,
  body?: any,
  options: UseFetchOptions<T> = {}
) => {
  return useServerApi<T>(url, {
    ...options,
    method: 'POST',
    body
  })
}

/**
 * PUT request (server-only)
 */
export const useServerApiPut = <T>(
  url: string,
  body?: any,
  options: UseFetchOptions<T> = {}
) => {
  return useServerApi<T>(url, {
    ...options,
    method: 'PUT',
    body
  })
}

/**
 * DELETE request (server-only)
 */
export const useServerApiDelete = <T>(url: string, options: UseFetchOptions<T> = {}) => {
  return useServerApi<T>(url, {
    ...options,
    method: 'DELETE'
  })
}

/**
 * PATCH request (server-only)
 */
export const useServerApiPatch = <T>(
  url: string,
  body?: any,
  options: UseFetchOptions<T> = {}
) => {
  return useServerApi<T>(url, {
    ...options,
    method: 'PATCH',
    body
  })
}