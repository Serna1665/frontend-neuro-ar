<template>
    <div>
        <v-container>
            <v-row justify="center">
                <v-col cols="12" md="12" class="text-center">
                    <v-progress-circular v-if="loading" indeterminate color="primary" />
                    <v-img v-else-if="imageUrl" :src="imageUrl" contain max-height="700" />
                    <v-alert v-else type="error">No se encontraron resultados para el usuario.</v-alert>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'

export default {
    name: 'WorkspaceJsonResultados',
    data() {
        return {
            imageUrl: '',
            loading: true,
        }
    },
    async mounted() {
        await this.fetchImage()
    },
    methods: {
        async fetchImage() {
            this.loading = true
            try {
                const authStore = useAuthStore()
                const user = authStore.getUser

                if (!user || !user.id) {
                    throw new Error('Usuario no autenticado')
                }

                const response = await this.$axios.post('/saludo', {
                    clave_secreta: 'shrek',
                    user_id: user.id,
                })

                const imageUrl = response.data.imagen

                // Validar si la imagen realmente existe (HEAD request)
                const imageExists = await this.checkImageExists(imageUrl)

                if (imageExists) {
                    this.imageUrl = imageUrl
                } else {
                    this.imageUrl = ''
                }

            } catch (error) {
                console.error('Error al obtener la imagen:', error)
                this.imageUrl = ''
            } finally {
                this.loading = false
            }
        },

        async checkImageExists(url) {
            try {
                const response = await fetch(url, { method: 'HEAD' })
                return response.ok
            } catch (e) {
                return false
            }
        },
    },
}
</script>