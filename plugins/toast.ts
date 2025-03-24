import { defineNuxtPlugin } from '#app'
import Toast, { useToast } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(Toast, {
        position: 'top-right',
        timeout: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        transition: 'Vue-Toastification__fade',
    })

    const toast = useToast()
    nuxtApp.provide('toast', toast)
})