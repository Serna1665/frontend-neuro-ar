<template>
    <div>
        <v-card>
            <v-card-title>
                <div class="d-flex align-center justify-space-between w-100">
                    <div class="d-flex align-center">
                        <img src="/public/imagenes/icono-logo.png" alt="Logo" height="70px" width="70px">
                        <v-divider inset vertical class="ml-6"></v-divider>
                        <strong class="ml-4 text-h5 font-weight-bold">Gestión de roles</strong>
                    </div>
                </div>
            </v-card-title>

            <v-container fluid>
                <v-data-table :items="roles" :headers="headers" :loading="loading" loading-text="cargando datos..."
                    :search="buscar" no-data-text="Sin registros previos">
                    <template v-slot:top>
                        <v-row class="d-flex align-center justify-space-between">
                            <v-col cols="6">
                                <v-text-field density="comfortable" v-model="buscar" label="Buscar por cualquier campo"
                                    variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="auto">
                                <v-btn color="success" size="small" rounded="lg" @click="abrirDialogoCrear()">
                                    Crear role
                                </v-btn>
                            </v-col>
                        </v-row>
                    </template>


                    <template v-slot:[`item.acciones`]="{ item }">
                        <v-tooltip location="top">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" color="warning" icon="mdi-pencil" size="small"
                                    @click="abrirDialogEditarRole(item)">
                                </v-icon>
                            </template>
                            <span>Editar permiso</span>
                        </v-tooltip>
                        <v-tooltip location="top">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" color="primary" icon="mdi-folder-key-outline" size="small"
                                    @click="abrirDialogAgregarRoles(item)">
                                </v-icon>
                            </template>
                            <span>Agregar permisos al role</span>
                        </v-tooltip>
                    </template>

                    <template v-slot:[`item.created_at`]="{ item }">
                        <div>
                            {{ item.created_at?.substring(0, 10) }}
                        </div>
                    </template>
                </v-data-table>
            </v-container>
        </v-card>

        <v-dialog v-model="dialogRole" max-width="900px" persistent>
            <v-card>
                <v-card-title>
                    <div class="d-flex align-center justify-space-between w-100">
                        <div class="d-flex align-center">
                            <img src="/public/imagenes/icono-logo.png" alt="Logo" height="70px" width="70px">
                            <v-divider inset vertical class="ml-6"></v-divider>
                            <strong
                                class="ml-4 text-h5 font-weight-bold">{{ modoEdicion ? 'Editar role' : 'Crear role' }}</strong>
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
                    <v-btn color="success" dark size="small" rounded="lg" variant="flat" @click="modoEdicion ? editarRole(datos) : crearRole()"
                        :loading="loadingCrear">
                        Guardar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="agregarPermisosDialog" max-width="900px" persistent>
            <agregarPermisos :datosRoles="datos" @cerrarDialog="agregarPermisosDialog = false" ref="dialogPermisos"></agregarPermisos>
        </v-dialog>

    </div>
</template>

<script>
import agregarPermisos from "@/components/Roles/agregarPermisosRoleComponente.vue"
    export default {
        components: {
            agregarPermisos
        },
        data() {
            return {
                roles: [],
                loading: false,
                name: '',
                dialogRole: false,
                loadingCrear: false,
                modoEdicion: false,
                buscar: '',
                datos: {},
                agregarPermisosDialog: false,
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
            }
        },

        mounted() {
            this.listarRoles()
        },

        methods: {
            listarRoles() {
                this.loading = true;
                this.$axios.get('/roles/listar').then((res) => {
                    this.roles = res.data
                }).catch((error) => {
                    this.$toast.error('Error al listar')
                }).finally(() => {
                    this.loading = false
                })
            },

            crearRole() {
                this.loadingCrear = true
                this.$axios.post('/roles/crear', {
                    name: this.name
                }).then(() => {
                    this.$toast.success('Agregado con éxito');
                    this.cerrarDialog();
                    this.listarRoles()
                }).catch((error) => {
                    this.$toast.error('Error al agregar')
                }).finally(() => {
                    this.loadingCrear = false
                })
            },

            cerrarDialog() {
                this.dialogRole = false,
                this.name = '';
            },

            abrirDialogoCrear(){
                this.modoEdicion = false;
                this.dialogRole = true;
            },

            abrirDialogEditarRole(item) {
                this.modoEdicion = true;
                this.name = item.name;
                this.datos = item;
                this.dialogRole = true;
            },

            editarRole(datos) {
                this.loadingCrear = true
                this.$axios.put('/roles/actualizar/' + datos.id,{
                    name: this.name
                }).then(() => {
                    this.$toast.success('Actualizado con éxito');
                    this.cerrarDialog();
                    this.listarRoles()
                }).catch((error) => {
                    this.$toast.error('Error al actualizar')
                }).finally(() => {
                    this.loadingCrear = false
                })
            },

            abrirDialogAgregarRoles(item) {
                this.datos = item
                this.agregarPermisosDialog = true;
                this.$nextTick(() => {
                    this.$refs.dialogPermisos.listarPermisosRole()
                })
            }
        }
    }
</script>