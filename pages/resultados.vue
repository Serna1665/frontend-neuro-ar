<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="12" class="text-center">
                <v-progress-circular v-if="loading" indeterminate color="primary" />

                <template v-else-if="imageUrl">
                    <v-img :src="imageUrl" contain max-height="700" class="mb-4" />
                    <v-btn href="https://imagenes.neuroar.com.co/static/paciente9.pdf" target="_blank" color="red"
                        variant="elevated">
                        descargar reporte IA
                    </v-btn>
                </template>

                <v-alert v-else type="error">No se encontró la imagen.</v-alert>
            </v-col>
        </v-row>
    </v-container>
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

                const pacienteId = authStore.user?.paciente?.id
                if (!pacienteId) throw new Error('Paciente no autenticado')


                const response = await this.$axios.get(`/ver-imagen-usuario/${pacienteId}`)

                this.imageUrl = response.data.imagen_url || ''
            } catch (error) {
                console.error('Error al obtener la imagen:', error)
                this.imageUrl = ''
            } finally {
                this.loading = false
            }
        },
    },
}
</script>
