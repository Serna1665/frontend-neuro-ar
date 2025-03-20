import axios from 'axios'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
    const api = axios.create({
        baseURL: 'http://127.0.0.1:8000/api', 
    })
    nuxtApp.provide('axios', api)
})
