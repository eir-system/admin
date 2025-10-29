export default defineNuxtConfig({
  runtimeConfig: {
    apiSecret: '123',
  },

  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/image',
    '@nuxt/ui',
  ],
})