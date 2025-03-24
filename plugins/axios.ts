import axios from 'axios'
import { defineNuxtPlugin } from '#app'
import { useAuthStore } from '@/stores/auth' 
export default defineNuxtPlugin((nuxtApp) => {
    const api = axios.create({
        baseURL: 'http://127.0.0.1:8000/api', 
    })

    api.interceptors.request.use((config) => {
        const authStore = useAuthStore() 
        if (authStore.token) {
            config.headers.Authorization = `Bearer ${authStore.token}`
        }
        return config
    }, (error) => {
        return Promise.reject(error)
    })

    nuxtApp.provide('axios', api)
})
