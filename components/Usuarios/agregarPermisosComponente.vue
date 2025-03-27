<template>
    <div>
        <v-card :loading="loadingPermisos" :disabled="loadingPermisos">
            <v-card-title>
                <div class="d-flex align-center justify-space-between w-100">
                    <div class="d-flex align-center">
                        <img src="/public/imagenes/icono-logo.png" alt="Logo" height="70px" width="70px">
                        <v-divider inset vertical class="ml-6"></v-divider>
                        <strong>Agregar permisos al usuario - {{ datosUsuarios?.name }}</strong>
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
                <v-btn color="success" variant="flat" size="small" @click="agregarPermisosUsuario()" :loading="loadingGuardarPermisos">
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
                permisos: [], 
                permiso: [], 
                permisosUsuario: [], 
                loadingPermisos: false,
                loadingGuardarPermisos: false,
            };
        },

        mounted() {
            this.listarPermisos();
            this.listarPermisosUsuario();
        },

        methods: {
            listarPermisos() {
                this.$axios.get('/permisos/listar').then((res) => {
                    this.permisos = res.data;
                }).catch((error) => {
                    console.log(error);
                });
            },

            listarPermisosUsuario() {
                this.loadingPermisos = true;
                this.$axios.get('/permisos/permisos-usuario/' + this.datosUsuarios.id)
                    .then((res) => {
                        this.permisosUsuario = res.data;
                        this.permiso = res.data.map((permiso) => permiso
                        .id); 
                    })
                    .catch(() => {
                        this.$toast.error('Error al listar permisos del usuario');
                    })
                    .finally(() => {
                        this.loadingPermisos = false;
                    });
            },

            agregarPermisosUsuario() {
                const data = {
                    user_id: this.datosUsuarios.id,
                    permiso: this.permiso, 
                };
                this.loadingGuardarPermisos = true;
                this.$axios.post('/permisos/asignar-permiso-usuario', data)
                    .then(() => {
                        this.$toast.success('Permisos guardados con éxito');
                        this.cerrarDialog()
                    })
                    .catch((error) => {
                        console.log(error);
                    }).finally(() => {
                        this.loadingGuardarPermisos = false
                    })
            },

            cerrarDialog() {
                this.$emit('cerrarDialog');
                this.permiso = [];
            },
        },
    };
</script>