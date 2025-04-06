<template>
    <div>
        <v-card>
            <v-card-title>
                <div class="d-flex align-center justify-space-between w-100">
                    <div class="d-flex align-center">
                        <img src="/public/imagenes/icono-logo.png" alt="Logo" height="70px" width="70px">
                        <v-divider inset vertical class="ml-6"></v-divider>
                        <strong class="ml-4 text-h5 font-weight-bold">Dependencias</strong>
                    </div>
                </div>
            </v-card-title>

            <v-container fluid>
                <v-data-table :items="dependencias" :search="buscar" :headers="headers" :loading="loading" loading-text="Cargando datos..." no-data-text="Sin dependencias registrados">
                    <template v-slot:top>
                        <v-row class="d-flex align-center justify-space-between">
                            <v-col cols="6">
                                <v-text-field density="comfortable" v-model="buscar" label="Buscar por cualquier campo"
                                    variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="auto">
                                <v-btn color="success" size="small" rounded="lg" @click="abrirDialogo()">Crear
                                    Dependencia
                                </v-btn>
                            </v-col>
                        </v-row>
                    </template>


                    <template v-slot:[`item.created_at`]="{ item }">
                        <div>
                            {{item.created_at?.substring(0,10)}}
                        </div>
                    </template>

                    <template v-slot:[`item.estado_id`]="{ item }">
                        <v-chip :color="item.estado_id == 1 ? 'green' : 'red'" label variant="flat" size="small">
                            {{ item.estado_id == 1 ? 'Activo' : 'Inactivo' }}</v-chip>
                    </template>

                    <template v-slot:[`item.acciones`]="{ item }">
                        <v-tooltip location="top">
                            <template v-slot:activator="{ props }" v-if="item.estado_id == 1">
                                <v-icon v-bind="props" color="warning" icon="mdi-pencil" size="small"
                                    @click="abrirDialogoEditar(item)">
                                </v-icon>
                            </template>
                            <span>Editar Sede</span>
                        </v-tooltip>
                        <v-tooltip location="top">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" :color="item.estado_id === 1 ? 'green' : 'red'"
                                    icon="mdi-toggle-switch" size="small" @click="cambiarEstado(item.id)"
                                    style="cursor: pointer">
                                </v-icon>
                            </template>
                            <span>{{ item.estado_id === 1 ? 'Inactivar' : 'Activar' }}</span>
                        </v-tooltip>

                    </template>
                </v-data-table>
            </v-container>


            <v-dialog v-model="dependenciaDialog" max-width="900px" persistent>
                <v-card>
                    <v-card-title>
                        <div class="d-flex align-center justify-space-between w-100">
                            <div class="d-flex align-center">
                                <img src="/public/imagenes/icono-logo.png" alt="Logo" height="70px" width="70px">
                                <v-divider inset vertical class="ml-6"></v-divider>
                                <strong class="ml-4 text-h5 font-weight-bold">{{ modoEdicion ? 'Editar dependencias' : 'Crear dependencia' }}</strong>
                            </div>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-form ref="formDependencia">
                            <v-col>
                                <v-text-field :rules="CampoRequerido" variant="outlined" label="Nombre"
                                    density="comfortable" v-model="dependencia.nombre"></v-text-field>
                            </v-col>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="red" dark size="small" rounded="lg" variant="flat" @click="cerrarDialogo()">
                            Cerrar
                        </v-btn>
                        <v-btn size="small" :color="modoEdicion ? 'warning' : 'success'" rounded="lg" variant="flat"
                            @click="modoEdicion ? actualizarDependencia(dependencia) : crearDependencia()" :loading="loadingCrear">
                            {{ modoEdicion ? 'Editar Sede' : 'Crear Sede'}}</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-card>
    </div>
</template>


<script>
    export default {
        name: 'WorkspaceJsonDependencias',

        data() {
            return {
                buscar: '',
                dependenciaDialog: false,
                loadingCrear: false,
                dependencias: [],
                modoEdicion: false,
                loading: false,
                dependencia: {
                    nombre: '',
                    estado_id: 1
                },
                CampoRequerido: [
                    v => !!v || 'Nombre es requerido',
                ],
                headers: [{
                        title: 'ID',
                        key: 'id'
                    },
                    {
                        title: 'Nombre',
                        key: 'nombre'
                    },
                    {
                        title: 'Estado',
                        key: 'estado_id'
                    },
                    {
                        title: 'Fecha de Creación',
                        key: 'created_at'
                    },
                    {
                        title: 'Acciones',
                        key: 'acciones'
                    },

                ]
            };
        },

        mounted() {
            this.listarDependencias();
        },

        methods: {
            abrirDialogo() {
                this.modoEdicion = false;
                this.dependenciaDialog = true;
            },

            cerrarDialogo() {
                this.dependenciaDialog = false;
                this.dependencia = {}
            },

            async crearDependencia() {
                const {
                    valid
                } = await this.$refs.formDependencia.validate();
                if (!valid) return;
                this.loadingCrear = true;
                try {
                    await this.$axios.post('/dependencias/crear', this.dependencia);
                    this.$toast.success('Dependencia creada con éxito');
                    this.cerrarDialogo();
                    this.listarDependencias();
                } catch {
                    this.$toast.error('Error al crear la sede, por favor intente nuevamente');
                } finally {
                    this.loadingCrear = false;
                }
            },

            listarDependencias() {
                this.loading = true
                this.$axios.get('/dependencias/listar').then((response) => {
                    this.dependencias = response.data;
                }).catch((error) => {
                    console.error(error);
                }).finally(() => {
                    this.loading = false;
                })
            },

            abrirDialogoEditar(item)
            {
                this.modoEdicion = true;
                this.dependenciaDialog = true;
                this.dependencia = {...item};
            },

            actualizarDependencia(item) {
                this.loadingCrear = true;
                this.$axios.put('/dependencias/actualizar/' + item.id, item).then(() => {
                    this.$toast.success('Dependencia actualizada con éxito');
                    this.cerrarDialogo();
                    this.listarDependencias();
                }).catch((error) => {
                    this.$toast.error('Error al actualizar la sede')
                    console.error(error)
                }).finally(() => {
                    this.loadingCrear = false;
                })
            },

            async cambiarEstado(item) {
                const result = await this.$swal.fire({
                    title: '¿Estás seguro?',
                    text: 'Cambiaras el estado de esta sede.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: "#22bb33",
                    confirmButtonText: 'Sí, cambiar estado',
                    cancelButtonColor: "#d33",
                    cancelButtonText: 'Cancelar',
                    
                });
                if (result.isConfirmed) {
                    this.$axios.post('/dependencias/cambiar-estado/' + item)
                        .then(() => {
                            this.$toast.success('Estado cambiado con éxito');
                            this.listarDependencias();
                        })
                        .catch((error) => {
                            console.error('Error al cambiar el estado', error);
                        });
                }
            }
        },
    };
</script>