import { defineStore } from 'pinia'
import { useNuxtApp } from '#app' 

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any,
    token: null as string | null,
    roles: [] as string[],     
    permissions: [] as string[] 
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
    hasPermission: (state) => (permission: string) => state.permissions.includes(permission),
    hasRole: (state) => (role: string) => state.roles.includes(role)
  },

  actions: {
    setUser(user: any, token: string) {
      this.user = user
      this.token = token
      this.roles = user.roles || []
      this.permissions = user.permissions || []

      if (process.client) {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('roles', JSON.stringify(this.roles))
        localStorage.setItem('permissions', JSON.stringify(this.permissions))
      }
    },

    async loadUserFromStorage() {
      if (process.client) {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
    
        if (storedToken && storedUser) {
          this.token = storedToken;
          this.user = JSON.parse(storedUser);
          this.roles = this.user.roles || [];
          this.permissions = this.user.permissions || [];
    
    
          const { $axios } = useNuxtApp();
          const response = await $axios.get('/me'); 
          this.user = response.data.user;
          this.roles = response.data.user.roles;
          this.permissions = response.data.user.permissions;
    
          localStorage.setItem('user', JSON.stringify(this.user));
        }
      }
    }
    
    

    // logout() {
    //   this.user = null;
    //   this.token = null;
    //   this.roles = [];
    //   this.permissions = [];

    //   if (process.client) {
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('user');
    //     localStorage.removeItem('roles');
    //     localStorage.removeItem('permissions');
    //   }
    // }
  }
})
