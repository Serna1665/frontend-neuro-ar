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

                <template v-else-if="imageUrl">
                    <v-img :src="imageUrl" contain max-height="700" class="mb-4" />
                    <v-btn href="https://imagenes.neuroar.com.co/static/paciente9.pdf" target="_blank" color="red" variant="elevated">
                        descargar reporte IA
                    </v-btn>
                </template>

                <v-alert v-else-if="selectedPaciente === null" type="info">
                    Seleccione un paciente para ver los resultados.
                </v-alert>
                <v-alert v-else type="error">No se encontró la imagen.</v-alert>
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
            imageUrl: '',
            loadingPacientes: false,
            loadingImage: false,
        }
    },
    watch: {
        selectedPaciente(newVal) {
            if (newVal) {
                this.fetchImage()
            } else {
                this.imageUrl = ''
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
        async fetchImage() {
            if (!this.selectedPaciente) return

            this.imageUrl = ''
            this.loadingImage = true

            try {
                const response = await this.$axios.get(`/ver-imagen-paciente/${this.selectedPaciente}`)
                this.imageUrl = response.data.imagen_url || ''
            } catch (error) {
                console.error('Error al obtener imagen del paciente:', error)
                this.imageUrl = ''
            } finally {
                this.loadingImage = false
            }
        },
        limpiarSeleccion() {
            this.selectedPaciente = null
            this.imageUrl = ''
        }
    },
    async mounted() {
        await this.fetchPacientes()
    }
}
</script>
