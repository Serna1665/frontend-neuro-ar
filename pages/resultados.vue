<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="12" class="text-center">
                <v-progress-circular v-if="loading" indeterminate color="primary" />

                <template v-else-if="imageUrls.length">
                    <v-row>
                        <v-col v-for="(url, index) in imageUrls" :key="index" cols="12" sm="6" md="4" class="mb-4">
                            <v-img :src="url" contain aspect-ratio="1" />
                        </v-col>
                    </v-row>

                    <v-btn :href="`https://imagenes.neuroar.com.co/static/paciente${pacienteId}.pdf`" target="_blank"
                        color="red" variant="elevated">
                        Descargar reporte IA
                    </v-btn>
                </template>

                <v-alert v-else type="error">
                    No se encontraron imágenes.
                </v-alert>
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
            imageUrls: [],
            loading: true,
            pacienteId: null,
        }
    },
    async mounted() {
        await this.fetchImages()
    },
    methods: {
        async fetchImages() {
            this.loading = true
            try {
                const authStore = useAuthStore()
                this.pacienteId = authStore.user?.paciente?.id

                if (!this.pacienteId) throw new Error('Paciente no autenticado')

                const response = await this.$axios.post('/pacientes/imagenes-paciente', {
                    user_id: this.pacienteId
                })

                this.imageUrls = response.data.imagenes || []
            } catch (error) {
                console.error('Error al obtener las imágenes:', error)
                this.imageUrls = []
            } finally {
                this.loading = false
            }
        },
    },
}
</script>