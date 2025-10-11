import type { UseFetchOptions } from 'nuxt/app'

/**
 * Custom fetch wrapper - barcha requestlarga avtomatik Bearer token qo'shadi
 */
export const useApi = <T>(
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

  // Merge qilingan optionslar
  const mergedOptions: UseFetchOptions<T> = {
    ...options,
    baseURL: config.public.apiBase,
    headers: {
      ...defaultHeaders,
      ...options.headers
    },
    
    // Error handling
    onResponseError({ response }) {
      // 401 - Unauthorized
      if (response.status === 401) {
        authStore.clearAuth()
        navigateTo('/login')
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
 * GET request
 */
export const useApiGet = <T>(url: string, options: UseFetchOptions<T> = {}) => {
  return useApi<T>(url, {
    ...options,
    method: 'GET'
  })
}

/**
 * POST request
 */
export const useApiPost = <T>(
  url: string,
  body?: any,
  options: UseFetchOptions<T> = {}
) => {
  return useApi<T>(url, {
    ...options,
    method: 'POST',
    body
  })
}

/**
 * PUT request
 */
export const useApiPut = <T>(
  url: string,
  body?: any,
  options: UseFetchOptions<T> = {}
) => {
  return useApi<T>(url, {
    ...options,
    method: 'PUT',
    body
  })
}

/**
 * DELETE request
 */
export const useApiDelete = <T>(url: string, options: UseFetchOptions<T> = {}) => {
  return useApi<T>(url, {
    ...options,
    method: 'DELETE'
  })
}

/**
 * PATCH request
 */
export const useApiPatch = <T>(
  url: string,
  body?: any,
  options: UseFetchOptions<T> = {}
) => {
  return useApi<T>(url, {
    ...options,
    method: 'PATCH',
    body
  })
}