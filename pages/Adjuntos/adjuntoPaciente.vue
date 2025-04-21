<template>
    <div>
        <v-card>
            <v-card-title>
                <div class="d-flex align-center justify-space-between w-100">
                    <div class="d-flex align-center">
                        <img src="/public/imagenes/icono-logo.png" alt="Logo" height="70px" width="70px">
                        <v-divider inset vertical class="ml-6"></v-divider>
                        <strong class="ml-4 text-h5 font-weight-bold">Adjuntos Por Paciente</strong>
                    </div>
                </div>
            </v-card-title>

            <v-container fluid>
                <v-row dense>
                    <v-col cols="9">
                        <v-autocomplete label="Paciente" density="comfortable" v-model="pacienteSeleccionado"
                            variant="outlined" :items="pacientes" item-title="nombreCompleto" item-value="id"
                            @update:model-value="listarAdjuntos"></v-autocomplete>
                    </v-col>

                    <v-col cols="3">
                        <v-btn color="red" size="small" @click="limpiar()">Limpiar</v-btn>
                    </v-col>
                </v-row>

                <v-data-table :items="adjuntosPacientes" v-if="adjuntosPacientes.length > 0" :headers="headers">

                    <template v-slot:[`item.nombrePaciente`]="{ item }">
                        <div>
                            {{ item.paciente.nombres }} - {{ item.paciente.apellidos }}
                        </div>
                    </template>
                    <template v-slot:[`item.created_at`]="{ item }">
                        <div>
                            {{ item.created_at?.substring(0, 10) }}
                        </div>
                    </template>
                    <template v-slot:[`item.adjunto`]="{ item }">
                        <v-btn icon @click="descargarAdjunto(item.id)" color="primary" size="small">
                            <v-icon>mdi-download</v-icon>
                        </v-btn>
                    </template>


                </v-data-table>
            </v-container>
        </v-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                pacientes: [],
                pacienteSeleccionado: null,
                adjuntosPacientes: [],
                headers: [{
                        title: 'Nombre Paciente',
                        key: 'nombrePaciente'
                    },
                    {
                        title: 'Número de documento',
                        key: 'paciente.numero_documento'
                    },
                    {
                        title: 'Usuario que registra',
                        key: 'usuario_registra.name'
                    },
                    {
                        title: 'Tipo de adjunto',
                        key: 'tipo_adjunto.nombre'
                    },
                    {
                        title: 'Fecha de carga',
                        key: 'created_at'
                    },
                    {
                        title: 'Adjunto',
                        key: 'adjunto',
                    }

                ]
            }
        },
        mounted() {
            this.fetchPacientes()
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

            listarAdjuntos() {
                this.$axios.get('adjuntos/adjuntos-paciente/' + this.pacienteSeleccionado).then((res) => {
                    this.adjuntosPacientes = res.data
                }).catch((error) => {
                    console.log(error.response.data.error)
                })
            },

            async descargarAdjunto(id) {
                try {
                    const response = await this.$axios.get(`/adjuntos/descarga-adjunto/${id}`, {
                        responseType: 'blob'
                    });

                    const contentType = response.headers['content-type'];
                    const blob = new Blob([response.data], {
                        type: contentType
                    }); 
                    const url = window.URL.createObjectURL(blob);

                    const contentDisposition = response.headers['content-disposition'];
                    let fileName = 'archivo_descargado';
                    if (contentDisposition) {
                        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
                        if (fileNameMatch && fileNameMatch.length === 2) fileName = fileNameMatch[1];
                    }

                    if (contentType.startsWith('image/') || contentType === 'application/pdf') {
                        window.open(url, '_blank');
                    } else {
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', fileName);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }

                } catch (error) {
                    console.error('Error al descargar el adjunto:', error);
                    this.$toast.error('No se pudo descargar el archivo.');
                }
            },

            limpiar()
            {
                this.adjuntosPacientes = []; 
                this.pacienteSeleccionado = ''
            }

        },
    }
</script>

<style>

</style>