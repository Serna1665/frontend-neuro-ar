<template>
    <div>
        <v-card :loading="loading" :disabled="loading">
            <v-card-title>
                <div class="d-flex align-center justify-space-between w-100">
                    <div class="d-flex align-center">
                        <img src="/public/imagenes/icono-logo.png" alt="Logo" height="70px" width="70px">
                        <v-divider inset vertical class="ml-6"></v-divider>
                        <strong>Agregar roles al usuario - {{ datosUsuarios?.name }}</strong>
                    </div>
                </div>
            </v-card-title>
            <v-card-text>
                <v-col cols="12">
                    <v-autocomplete label="Roles" variant="outlined" density="comfortable" :items="roles" v-model="role"
                        item-title="name" item-value="id" chips multiple closable-chips>
                    </v-autocomplete>
                </v-col>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" dark variant="flat" size="small" @click="cerrarDialog()">Cerrar</v-btn>
                <v-btn color="success" variant="flat" size="small" @click="agregarRolesUsuario()"
                    :loading="loadingRoleAsignar">
                    Guardar cambios
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
    export default {
        props: ['datosUsuarios'],
        data() {
            return {
                roles: [], 
                role: [], 
                loadingRoleAsignar: false,
                loading: false
            }
        },

        mounted() {
            this.listarRoles();
            this.listarRolesUsuario(); 
        },

        methods: {
            listarRoles() {
                this.loading = true;
                this.$axios.get('/roles/listar').then((res) => {
                    this.roles = res.data; 
                }).catch(() => {
                    this.$toast.error('Error al listar roles');
                }).finally(() => {
                    this.loading = false;
                });
            },

            listarRolesUsuario() {
                this.loading = true;
                this.$axios.get('/roles/roles-usuario/' + this.datosUsuarios.id).then((res) => {
                    this.role = res.data.map((rol) => rol.id);
                }).catch(() => {
                    this.$toast.error('Error al listar roles del usuario');
                }).finally(() => {
                    this.loading = false;
                });
            },

            agregarRolesUsuario() {
                const data = {
                    user_id: this.datosUsuarios.id,
                    role_id: this.role
                }
                this.loadingRoleAsignar = true;
                this.$axios.post('/roles/asignar-roles', data).then(() => {
                    this.$toast.success('Roles asignados con éxito');
                    this.cerrarDialog()
                }).catch(() => {
                    this.$toast.error('Error al asignar roles');
                }).finally(() => {
                    this.loadingRoleAsignar = false;
                });
            },

            cerrarDialog() {
                this.$emit('cerrarDialog');
                this.role = [];
            }
        },
    }
</script>