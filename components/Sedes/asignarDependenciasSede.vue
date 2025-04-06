<template>
    <div>
        <v-card>
            <v-card-title>
                <div class="d-flex align-center justify-space-between w-100">
                    <div class="d-flex align-center">
                        <img src="/public/imagenes/icono-logo.png" alt="Logo" height="70px" width="70px">
                        <v-divider inset vertical class="ml-6"></v-divider>
                        <strong class="ml-4 text-h5 font-weight-bold">Asignar despendencias a la sede
                            <b>{{ sedes?.nombre }}</b></strong>
                    </div>
                </div>
            </v-card-title>
            <v-card-text>
                <v-autocomplete v-model="dependencia_id" :items="dependencias" item-title="nombre" item-value="id"
                    label="Seleccione las dependencia" chips multiple :loading="loading" variant="outlined"
                    density="comfortable" closable-chips></v-autocomplete>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" dark size="small" rounded="lg" variant="flat" @click="cerrarDialogo()">
                    Cerrar
                </v-btn>
                <v-btn size="small" :color="modoEdicion ? 'warning' : 'success'" rounded="lg" variant="flat"
                    @click="asignarDependenciasSede()" :loading="loadingCrear">Guardar</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
    export default {
        props: ['sedes'],
        name: 'WorkspaceJsonAsignarDependenciasSede',

        data() {
            return {
                dependencia_id: [],
                dependencias: [],
                loading: false,
                loadingCrear: false,
            };
        },

        mounted() {
            this.listarDependencias();
            this.obtenerDependenciasSede();
        },
        methods: {
            listarDependencias() {
                this.loading = true;
                this.$axios.get('/dependencias/listar-dependencias-activas').then((res) => {
                    this.dependencias = res.data;
                }).catch((error) => {
                    console.log(error)
                }).finally(() => {
                    this.loading = false;
                })
            },

            asignarDependenciasSede() {
                this.loadingCrear = true;
                const data = {
                    sede_id: this.sedes.id,
                    dependencia_id: this.dependencia_id,
                }
                this.$axios.post('/sedes/asignar-dependencias', data).then(() => {
                    this.cerrarDialogo();
                    this.$toast.success('dependencias asignada con éxito');
                }).catch((error) => {
                    console.log(error)
                }).finally(() => {
                    this.loadingCrear = false;
                })
            },

            cerrarDialogo() {
                this.dependencia_id = [],
                    this.$emit('cerrarDialogo')
            },

            obtenerDependenciasSede() {
                this.loading = true;
                this.$axios.get(`/sedes/listar-dependencias-sede/${this.sedes.id}`).then((res) => {
                    this.dependencia_id = res.data.dependencias.map(dep => dep.id);
                }).catch((error) => {
                    console.error(error);
                }).finally(() => {
                    this.loading = false;
                });
            }


        },
    };
</script>