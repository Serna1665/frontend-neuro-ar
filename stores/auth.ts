import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user
  },

  actions: {
    setUser(user, token) {
      this.user = user
      this.token = token

      if (process.client) { // Solo ejecuta esto en el navegador
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
      }
    },

    loadUserFromStorage() {
      if (process.client) { // Evitar errores en SSR
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')

        if (storedToken && storedUser) {
          this.token = storedToken
          this.user = JSON.parse(storedUser)
        }
      }
    },

    logout() {
      this.user = null
      this.token = null

      if (process.client) { // Evitar errores en SSR
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
  }
})
