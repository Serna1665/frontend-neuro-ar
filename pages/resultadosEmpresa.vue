<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="8">
                <v-select v-model="selectedPaciente" :items="pacientes" item-title="nombreCompleto" item-value="id"
                    label="Seleccione un paciente" :loading="loadingPacientes"
                    :disabled="loadingPacientes || loadingImage" clearable />
            </v-col>
        </v-row>

        <v-row justify="center">
            <v-col cols="12" md="8" class="text-center">
                <v-btn @click="limpiarSeleccion" color="primary" variant="outlined" class="mb-4">
                    Limpiar selección
                </v-btn>
            </v-col>
        </v-row>

        <v-row justify="center">
            <v-col cols="12" md="12" class="text-center">
                <v-progress-circular v-if="loadingImage" indeterminate color="primary" />

                <template v-else-if="imageUrls.length">
                    <v-row>
                        <v-col v-for="(url, index) in imageUrls" :key="index" cols="12" sm="6" md="4" class="mb-4">
                            <v-img :src="url" aspect-ratio="1" contain />
                        </v-col>
                    </v-row>

                    <v-btn href="https://imagenes.neuroar.com.co/static/paciente9.pdf" target="_blank" color="red"
                        variant="elevated">
                        descargar reporte IA
                    </v-btn>

                    <!-- <v-btn :href="`https://imagenes.neuroar.com.co/static/paciente${selectedPaciente}.pdf`"
                        target="_blank" color="red" variant="elevated">
                        Descargar reporte IA
                    </v-btn> -->
                </template>

                <v-alert v-else-if="selectedPaciente === null" type="info">
                    Seleccione un paciente para ver los resultados.
                </v-alert>

                <v-alert v-else type="error">
                    No se encontraron imágenes para este paciente.
                </v-alert>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { useAuthStore } from '@/stores/auth'

export default {
    name: 'WorkspaceJsonResultadosEmpresa',
    data() {
        return {
            pacientes: [],
            selectedPaciente: null,
            imageUrls: [],
            loadingPacientes: false,
            loadingImage: false,
        }
    },
    watch: {
        selectedPaciente(newVal) {
            if (newVal) {
                this.fetchImages()
            } else {
                this.imageUrls = []
            }
        }
    },
    methods: {
        async fetchPacientes() {
            this.loadingPacientes = true
            try {
                const authStore = useAuthStore()
                const user = authStore.getUser

                if (!user || !user.id) {
                    throw new Error('Usuario no autenticado')
                }

                console.log(user, 'usuario');


                const response = await this.$axios.get(`/pacientes-empresa/${user.id}`)
                this.pacientes = response.data.map(p => ({
                    ...p,
                    nombreCompleto: `${p.nombres} ${p.apellidos}`
                }))
            } catch (error) {
                console.error('Error al obtener pacientes:', error)
            } finally {
                this.loadingPacientes = false
            }
        },
        async fetchImages() {
            if (!this.selectedPaciente) return

            this.imageUrls = []
            this.loadingImage = true

            try {
                const response = await this.$axios.post('/pacientes/imagenes-paciente', {
                    user_id: this.selectedPaciente
                })

                this.imageUrls = response.data.imagenes || []
            } catch (error) {
                console.error('Error al obtener imágenes del paciente:', error)
                this.imageUrls = []
            } finally {
                this.loadingImage = false
            }
        },
        limpiarSeleccion() {
            this.selectedPaciente = null
            this.imageUrls = []
        }
    },
    async mounted() {
        await this.fetchPacientes()
    }
}
</script>