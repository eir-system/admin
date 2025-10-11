// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // SSR yoqilgan - barcha API requestlar server-side'da bajariladi
  ssr: true,

  // Nitro server configuration
  nitro: {
    compressPublicAssets: true,
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@pinia/nuxt',
    '@sidebase/nuxt-auth',
    '@nuxtjs/turnstile'
  ],

  // Runtime config
  runtimeConfig: {
    // Server-side only keys
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'your-access-secret-key-change-in-production',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production',
    
    // Public keys (client-side)
    public: {
      apiBase: process.env.API_BASE_URL || '/api'
    }
  },

  // Authentication configuration
  auth: {
    baseURL: process.env.AUTH_ORIGIN || 'http://localhost:3000/api/auth',
    provider: {
      type: 'local',
      endpoints: {
        signIn: { path: '/login', method: 'post' },
        signOut: { path: '/logout', method: 'post' },
        signUp: { path: '/register', method: 'post' },
        getSession: { path: '/session', method: 'get' }
      },
      token: {
        signInResponseTokenPointer: '/accessToken',
        type: 'Bearer',
        headerName: 'Authorization',
        maxAgeInSeconds: 60 * 15, // 15 minutes
        sameSiteAttribute: 'lax'
      },
      refresh: {
        isEnabled: true,
        endpoint: { path: '/refresh', method: 'post' },
        refreshOnlyToken: true,
        token: {
          signInResponseRefreshTokenPointer: '/refreshToken',
          refreshRequestTokenPointer: '/refreshToken',
          maxAgeInSeconds: 60 * 60 * 24 * 7 // 7 days
        }
      }
    },
    globalAppMiddleware: {
      isEnabled: true
    },
    session: {
      enableRefreshOnWindowFocus: true,
      enableRefreshPeriodically: 5000 // Refresh every 5 seconds if needed
    }
  },

  // Pinia store configuration
  pinia: {
    storesDirs: ['./app/stores/**']
  },

  // Color mode configuration
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: ''
  },

  // i18n configuration
  i18n: {
    locales: [
      { code: 'uz', iso: 'uz-UZ', file: 'uz.json' },
      { code: 'ru', iso: 'ru-RU', file: 'ru.json' },
      { code: 'en', iso: 'en-US', file: 'en.json' }
    ],
    defaultLocale: 'uz',
    strategy: 'no_prefix',
    langDir: 'locales'
  },

  // CSS configuration
  css: ['~/assets/css/main.css'],

  // Robots configuration
  robots: {
    allow: ['/'],
    disallow: ['/admin', '/api']
  },

  // Sitemap configuration
  sitemap: {
    hostname: process.env.SITE_URL || 'http://localhost:3000',
    gzip: true
  }
})