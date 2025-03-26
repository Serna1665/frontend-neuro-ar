import axios from 'axios'
import { defineNuxtPlugin } from '#app'
import { useAuthStore } from '@/stores/auth' 
export default defineNuxtPlugin((nuxtApp) => {
    const api = axios.create({
        baseURL: 'http://app.neuroar.com.co:8080/api', 
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
