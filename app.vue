<template>
  <v-app>
    <NuxtPage />
  </v-app>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'

export default {
  setup() {
    const authStore = useAuthStore()

    onMounted(() => {
      authStore.loadUserFromStorage() // Se ejecuta solo en el cliente
    })
  }
}
</script>
