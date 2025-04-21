<template>
    <div>
        <v-card>
            <v-card-title>
                <div class="d-flex align-center justify-space-between w-100">
                    <div class="d-flex align-center">
                        <img src="/public/imagenes/icono-logo.png" alt="Logo" height="70px" width="70px">
                        <v-divider inset vertical class="ml-6"></v-divider>
                        <strong class="ml-4 text-h5 font-weight-bold">Carga Adjuntos</strong>
                    </div>
                </div>
            </v-card-title>

            <v-container fluid>
                <v-card-text>
                    <v-col>
                        <v-autocomplete label="Categorías" v-model="adjuntos.categoria_adjunto_id" density="comfortable"
                            variant="outlined" :items="categorias" item-title="nombre" item-value="id"
                            @update:model-value="listarTipoAdjunto">
                        </v-autocomplete>
                    </v-col>
                    <v-col>
                        <v-autocomplete label="Tipo de adjunto" :disabled="!adjuntos.categoria_adjunto_id"
                            v-model="adjuntos.tipo_adjunto_id" density="comfortable" variant="outlined"
                            :items="tipoAdjuntos" item-title="nombre" item-value="id"
                            @update:model-value="fetchPacientes">
                        </v-autocomplete>
                    </v-col>
                    <v-col>
                        <v-autocomplete :loading="loadingPacientes" :items="pacientes" item-title="nombreCompleto"
                            :disabled="!adjuntos.tipo_adjunto_id" item-value="id" label="Paciente" variant="outlined" v-model="adjuntos.paciente_id"
                            density="comfortable">
                        </v-autocomplete>
                    </v-col>
                    <v-col>
                        <v-file-input label="Adjuntar archivos" v-model="adjuntos.archivo" chips multiple
                            variant="outlined" density="comfortable" prepend-icon="mdi-paperclip" :rules="archivoRules"
                            show-size closable accept=".pdf,.png,.jpg,.jpeg"
                            :disabled="!adjuntos.tipo_adjunto_id" />
                    </v-col>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" size="small" variant="flat" rounded="lg" @click="limpiarData()">Limpiar</v-btn>
                    <v-btn color="success" size="small" variant="flat" rounded="lg" @click="guardarAdjuntos()">Guardar</v-btn>
                </v-card-actions>
            </v-container>
        </v-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                pacientes: [],
                loadingPacientes: false,
                categorias: [],
                tipoAdjuntos: [],
                adjuntos: {
                    categoria_adjunto_id: null,
                    tipo_adjunto_id: null,
                    archivo: null,
                    paciente_id: null
                },
                archivoRules: [
                    (files) => {
                        if (!files || files.length === 0) return 'Debes adjuntar al menos un archivo.'
                        return true
                    },
                    (files) => {
                        if (!files || files.length === 0) return true

                        const tiposPermitidos = [
                            'application/pdf',
                            'image/png',
                            'image/jpeg',
                            'application/msword',
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                            'application/vnd.ms-excel',
                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                        ]

                        const archivosInvalidos = files.filter(file => !tiposPermitidos.includes(file.type))
                        if (archivosInvalidos.length > 0) {
                            return 'Uno o más archivos tienen un formato no permitido.'
                        }
                        return true
                    },
                    (files) => {
                        if (!files || files.length === 0) return true

                        const maxSize = 600 * 1024 * 1024 // 600MB
                        const archivosPesados = files.filter(file => file.size > maxSize)
                        if (archivosPesados.length > 0) {
                            return 'Uno o más archivos superan el tamaño máximo de 600MB.'
                        }
                        return true
                    }
                ]

            }
        },

        mounted() {
            this.listarCategorias()
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
                    this.$toast.info(
                        'Recuerda que los pacientes cargados en esta lista son aquellos que estan asociados a tu misma empresa'
                    )
                } catch (error) {
                    console.error('Error al obtener pacientes:', error)
                } finally {
                    this.loadingPacientes = false
                }
            },

            listarCategorias() {
                this.loading = true
                this.$axios.get('categorias-adjuntos/listar').then((res) => {
                    this.categorias = res.data
                }).catch((error) => {
                    console.error(error.response.data.error)
                }).finally(() => {
                    this.loading = false
                })
            },

            listarTipoAdjunto() {
                this.loading = true
                this.$axios.get('tipo-adjuntos/listar-por-categoria/' + this.adjuntos.categoria_adjunto_id).then((
                    res) => {
                    this.tipoAdjuntos = res.data
                }).catch((error) => {
                    console.error(error.response.data.error)
                }).finally(() => {
                    this.loading = false
                })
            },


            async guardarAdjuntos() {
                if (!this.adjuntos.archivo || this.adjuntos.archivo.length === 0) {
                    this.$toast.error('Debe seleccionar al menos un archivo');
                    return;
                }

                const formData = new FormData();
                formData.append('paciente_id', this.adjuntos.paciente_id);
                formData.append('tipo_adjuntos_id', this.adjuntos.tipo_adjunto_id);
                formData.append('paciente_id', this.adjuntos.paciente_id);

                for (let i = 0; i < this.adjuntos.archivo.length; i++) {
                    formData.append('file', this.adjuntos.archivo[i]);
                }

                try {
                    const response = await this.$axios.post('/adjuntos/crear', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    this.$toast.success('Archivo adjunto guardado con éxito');
                    this.limpiarData();
                    console.log(response.data);
                } catch (error) {
                    console.error(error);
                    this.$toast.error('Error al guardar el adjunto');
                }
            },

            limpiarData()
            {
                this.adjuntos = {}
            }
        },
    }
</script>

<style></style>