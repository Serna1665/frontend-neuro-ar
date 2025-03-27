<template>
    <div>
        <v-card>
            <v-card-title>
                <div class="d-flex align-center justify-space-between w-100">
                    <div class="d-flex align-center">
                        <img src="/public/imagenes/icono-logo.png" alt="Logo" height="70px" width="70px">
                        <v-divider inset vertical class="ml-6"></v-divider>
                        <strong class="ml-4 text-h5 font-weight-bold">Usuarios</strong>
                    </div>
                </div>
            </v-card-title>

            <v-container fluid>
                <v-row>
                    <v-col cols="4">
                        <v-text-field label="Correo electronico" density="comfortable" variant="outlined"
                            v-model="buscar.email" />
                    </v-col>
                    <v-col cols="4">
                        <v-text-field label="Número de documento" density="comfortable" variant="outlined"
                            v-model="buscar.documento" />
                    </v-col>
                    <v-col cols="4">
                        <v-text-field label="Nombre del usuario" density="comfortable" variant="outlined"
                            v-model="buscar.nombre" />
                    </v-col>
                    <v-col cols="3" class="d-flex align-center">
                        <v-btn color="primary" @click="buscarUsuario()" :loading="loading" class="mr-2">Filtrar usuario
                        </v-btn>
                        <v-btn color="red" dark @click="limpiarFiltros()">Limpiar</v-btn>
                    </v-col>
                </v-row>
            </v-container>

            <v-col cols="12" v-if="usuarios.length > 0">
                <v-data-table no-data-text="Sin usuarios registrados" :headers="headers" :items="usuarios">
                    <template v-slot:[`item.created_at`]="{ item }">
                        <div>
                            {{item.created_at?.substring(0,10)}}
                        </div>
                    </template>

                    <template v-slot:[`item.acciones`]="{ item }">
                        <v-tooltip location="top">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" color="warning" icon="mdi-pencil" size="small"
                                    @click="abrirDialogEditarUsuario(item)">
                                </v-icon>
                            </template>
                            <span>Editar usuario</span>
                        </v-tooltip>
                        <v-tooltip location="top">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" color="primary" icon="mdi-account-key-outline" size="small"
                                    @click="abrirDialogoPermisos(item)">
                                </v-icon>
                            </template>
                            <span>Agregar permisos al usuario</span>
                        </v-tooltip>
                        <v-tooltip location="top">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" color="purple" icon="mdi-table-key" size="small"
                                    @click="abrirDialogoRoles(item)">
                                </v-icon>
                            </template>
                            <span>Agregar roles al usuario</span>
                        </v-tooltip>
                    </template>
                </v-data-table>
            </v-col>
        </v-card>

        <v-dialog v-model="dialogEditarUsuario" persistent>
            <editarUsuario ref="editarUsuarioRef" :datosUsuarios="datosUsuarios"
                @cerrarDialogo="dialogEditarUsuario = false" @pacienteActualizado="buscarUsuario()"></editarUsuario>
        </v-dialog>

        <v-dialog v-model="dialogAgregarPermisos" persistent max-width="900px">
            <agregarPermisos :datosUsuarios="datosUsuarios" @cerrarDialog="dialogAgregarPermisos = false" ref="refPermisos"></agregarPermisos>
        </v-dialog>

        <v-dialog v-model="dialogAgregarRoles" persistent max-width="900px">
            <agregarRoles :datosUsuarios="datosUsuarios" ref="refRolesUsuario" @cerrarDialog="dialogAgregarRoles = false"></agregarRoles>
        </v-dialog>
    </div>
</template>

<script>
    import editarUsuario from "@/components/Usuarios/editarUsuarioComponente.vue";
    import agregarPermisos from "@/components/Usuarios/agregarPermisosComponente.vue";
    import agregarRoles from "@/components/Usuarios/agregarRolesUsuarioComponente.vue";
    export default {
        components: {
            editarUsuario,
            agregarPermisos,
            agregarRoles
        },
        middleware: 'auth',
        data() {
            return {
                buscar: {
                    email: '',
                    documento: '',
                    nombre: '',
                },
                usuarios: [],
                loading: false,
                dialogEditarUsuario: false,
                dialogAgregarPermisos: false, 
                dialogAgregarRoles: false, 
                datosUsuarios: {},
                headers: [{
                        title: 'ID',
                        key: 'id'
                    },
                    {
                        title: 'Nombre',
                        key: 'name'
                    },
                    {
                        title: 'Email',
                        key: 'email'
                    },
                    {
                        title: 'Número de documento',
                        key: 'numero_documento'
                    },
                    {
                        title: 'Fecha de creación',
                        key: 'created_at'
                    },
                    {
                        title: 'Acciones',
                        key: 'acciones'
                    }
                ]
            }
        },

        methods: {
            buscarUsuario() {
                const params = {
                    ...this.buscar
                }
                this.loading = true
                this.$axios.get('pacientes/buscar', {
                    params
                }).then((res) => {
                    this.usuarios = res.data
                }).catch((error) => {
                    console.log(error.response.data.error)
                }).finally(() => {
                    this.loading = false
                })
            },

            abrirDialogEditarUsuario(item) {
                this.datosUsuarios = item;
                this.dialogEditarUsuario = true
                this.$nextTick(() => {
                    this.$refs.editarUsuarioRef.obtenerDatosUsuario()
                })
            },
            limpiarFiltros(){
                this.buscar = {},
                this.usuarios = []
            },

            abrirDialogoPermisos(item) {
                this.datosUsuarios = item;
                this.dialogAgregarPermisos = true;
                this.$nextTick(() => {
                    this.$refs.refPermisos.listarPermisosUsuario();
                })
            },

            abrirDialogoRoles(item) {
                this.datosUsuarios = item;
                this.dialogAgregarRoles = true;
                this.$nextTick(() => {
                    this.$refs.refRolesUsuario.listarRolesUsuario()
                })
            }
        }
    }
</script>