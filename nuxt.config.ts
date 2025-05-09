export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/image', '@pinia/nuxt'],
  css: ['vuetify/styles'],
  build: {
    transpile: ['vuetify', 'vue-toastification'],
  },  
})