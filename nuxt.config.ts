import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL,
      accessTtl: process.env.NUXT_ACCESS_TTL,
      refreshTtl: process.env.NUXT_REFRESH_TTL
    },
  },  

  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/image', '@nuxt/ui'],

  ui: {
    colorMode: false,
  },

  css: ['./app/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },
})
