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
                            v-model="buscar.email">
                        </v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field label="Número de documento" density="comfortable" variant="outlined"
                            v-model="buscar.documento">
                        </v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field label="Nombre del usuario" density="comfortable" variant="outlined"
                            v-model="buscar.nombre">
                        </v-text-field>
                    </v-col>
                </v-row>
                <v-col>
                    <v-btn color="primary" @click="buscarUsuario()" :loading="loading">Filtrar usuario</v-btn>
                </v-col>
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
                    </template>
                </v-data-table>
            </v-col>
        </v-card>

        <v-dialog v-model="dialogEditarUsuario">
            <editarUsuario ref="editarUsuarioRef" :datosUsuarios="datosUsuarios"></editarUsuario>
        </v-dialog>
    </div>
</template>

<script>
import editarUsuario from "@/components/Usuarios/editarUsuarioComponente.vue";
    export default {
        components: {
            editarUsuario
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
            }
        }
    }
</script>