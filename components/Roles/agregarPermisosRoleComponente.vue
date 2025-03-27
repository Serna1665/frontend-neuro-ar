<template>
    <div>
        <v-card :loading="loading" :disabled="loading">
            <v-card-title>
                <div class="d-flex align-center justify-space-between w-100">
                    <div class="d-flex align-center">
                        <img src="/public/imagenes/icono-logo.png" alt="Logo" height="70px" width="70px">
                        <v-divider inset vertical class="ml-6"></v-divider>
                        <strong>Agregar permisos al role - {{ datosRoles?.name }}</strong>
                    </div>
                </div>
            </v-card-title>
            <v-card-text>
                <v-col cols="12">
                    <v-autocomplete label="Permisos" variant="outlined" density="comfortable" :items="permisos"
                        v-model="permiso" item-title="name" item-value="id" chips multiple closable-chips>
                    </v-autocomplete>
                </v-col>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" dark variant="flat" size="small" @click="cerrarDialog()">Cerrar</v-btn>
                <v-btn color="success" variant="flat" size="small" @click="asignarPermisoArole()"
                    :loading="loadingCrear">
                    Guardar cambios
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
    export default {
        props: ['datosRoles'],
        data() {
            return {
                permisos: [],
                permiso: [],
                permisosRole: [],
                loading: false,
                loadingCrear: false
            }
        },


        mounted() {
            this.listarPermisos()
        },

        methods: {
            listarPermisos() {
                this.$axios.get('/permisos/listar').then((res) => {
                    this.permisos = res.data;
                }).catch((error) => {
                    console.log(error);
                });
            },

            listarPermisosRole() {
                this.loading = true
                this.$axios.get('/permisos/listar-permiso-role/' + this.datosRoles.id).then((res) => {
                    this.permisosRole = res.data;
                    this.permiso = res.data.map((permiso) => permiso.id);
                }).catch((error) => {
                    console.log(error);
                }).finally(() => {
                    this.loading = false
                })
            },

            asignarPermisoArole() {
                const data = {
                    role_id: this.datosRoles.id,
                    permiso: this.permiso
                }
                this.loadingCrear = true
                this.$axios.post('permisos/asignar-permiso-role', data).then(() => {
                    this.$toast.success('Agregado con éxito');
                    this.cerrarDialog()
                }).catch((error) => {
                    this.$toast.error('Error al asignar permiso al role')
                }).finally(() => {
                    this.loadingCrear = false
                })
            },

            cerrarDialog() {
                this.$emit('cerrarDialog');
                this.permiso = [];
            },
        },
    }
</script>