import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { defineNuxtPlugin, useHead } from '#app'
import 'vuetify/styles'

export default defineNuxtPlugin((nuxtApp) => {
  useHead({
    link: [
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;600;700&display=swap'
      }
    ]
  })

  const vuetify = createVuetify({
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
    },
    defaults: {
      VApp: {
        style: {
          fontFamily: 'Nunito Sans, sans-serif'
        }
      }
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
