<template>
    <div>
        <v-card>
            <v-card-title>
                <div class="d-flex align-center justify-space-between w-100">
                    <div class="d-flex align-center">
                        <img src="/public/imagenes/icono-logo.png" alt="Logo" height="70px" width="70px">
                        <v-divider inset vertical class="ml-6"></v-divider>
                        <strong class="ml-4 text-h5 font-weight-bold">Gestión de permisos</strong>
                    </div>
                </div>
            </v-card-title>

            <v-container fluid>
                <v-data-table :items="permisos" :headers="headers" :loading="loading" loading-text="cargando datos..."
                    :search="buscar" no-data-text="Sin registros previos">
                    <template v-slot:top>
                        <v-row class="d-flex align-center justify-space-between">
                            <v-col cols="6">
                                <v-text-field density="comfortable" v-model="buscar" label="Buscar por cualquier campo"
                                    variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="auto">
                                <v-btn color="success" size="small" rounded="lg" @click="AbrirDialogoCrearPermiso()">
                                    Crear permiso
                                </v-btn>
                            </v-col>
                        </v-row>
                    </template>

                    <template v-slot:[`item.created_at`]="{ item }">
                        <div>
                            {{ item.created_at?.substring(0, 10) }}
                        </div>
                    </template>

                    <template v-slot:[`item.acciones`]="{ item }">
                        <v-tooltip location="top">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" color="warning" icon="mdi-pencil" size="small"
                                    @click="abrirDialogEditarPermiso(item)">
                                </v-icon>
                            </template>
                            <span>Editar permiso</span>
                        </v-tooltip>

                    </template>
                </v-data-table>
            </v-container>
        </v-card>

        <v-dialog v-model="dialogCrearPermiso" max-width="900px" persistent>
            <v-card>
                <v-card-title>
                    <div class="d-flex align-center justify-space-between w-100">
                        <div class="d-flex align-center">
                            <img src="/public/imagenes/icono-logo.png" alt="Logo" height="70px" width="70px">
                            <v-divider inset vertical class="ml-6"></v-divider>
                            <strong
                                class="ml-4 text-h5 font-weight-bold">{{ modoEdicion ? 'Editar Permiso' : 'Crear Permiso' }}</strong>
                        </div>
                    </div>
                </v-card-title>
                <v-card-text>
                    <v-col cols="12">
                        <v-text-field label="Nombre" density="comfortable" variant="outlined" v-model="name">
                        </v-text-field>
                    </v-col>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" dark size="small" rounded="lg" variant="flat" @click="cerrarDialog()">
                        Cerrar
                    </v-btn>
                    <v-btn color="success" dark size="small" rounded="lg" variant="flat"
                        @click="modoEdicion ? editarPermiso(datos) : guardarPermiso()" :loading="loadingCrear">
                        Guardar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                permisos: [],
                name: '',
                loading: false,
                buscar: '',
                modoEdicion: false,
                datos: {},
                headers: [{
                        title: 'ID',
                        key: 'id'
                    },
                    {
                        title: 'Nombre',
                        key: 'name'
                    },
                    {
                        title: 'Fecha de creación',
                        key: 'created_at'
                    },
                    {
                        title: 'Acciones',
                        key: 'acciones'
                    }
                ],
                dialogCrearPermiso: false,
                loadingCrear: false
            }
        },

        mounted() {
            this.listarPermisos()
        },

        methods: {
            listarPermisos() {
                this.loading = true
                this.$axios.get('/permisos/listar').then((res) => {
                    this.permisos = res.data
                }).catch((error) => {
                    console.log(error)
                }).finally(() => {
                    this.loading = false
                })
            },

            AbrirDialogoCrearPermiso() {
                this.modoEdicion = false
                this.dialogCrearPermiso = true;
            },

            cerrarDialog() {
                this.dialogCrearPermiso = false;
                this.name = ''
            },

            abrirDialogEditarPermiso(item) {
                this.modoEdicion = true
                this.name = item.name;
                this.datos = item
                this.dialogCrearPermiso = true;
            },

            guardarPermiso() {
                this.loadingCrear = true
                this.$axios.post('/permisos/crear', {
                    name: this.name
                }).then(() => {
                    this.$toast.success('Agregado con éxito');
                    this.cerrarDialog();
                    this.listarPermisos();
                }).catch((error) => {
                    this.$toast.error('error al crear')
                }).finally(() => {
                    this.loadingCrear = false
                })
            },

            editarPermiso(datos) {
                this.loadingCrear = true;
                this.$axios.put('/permisos/actualizar/' + datos.id, {
                    name: this.name
                }).then(() => {
                    this.$toast.success('Permiso actualizado con éxito');
                    this.cerrarDialog();
                    this.listarPermisos();
                }).catch((error) => {
                    this.$toast.error('error al crear')
                }).finally(() => {
                    this.loadingCrear = false
                })
            }
        }
    }
</script>