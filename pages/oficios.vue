<template>
    <div>
        <v-card>
            <v-card-title>
                <div class="d-flex align-center justify-space-between w-100">
                    <div class="d-flex align-center">
                        <img src="/public/imagenes/neuroar.png" alt="Logo" height="70px" width="70px">
                        <v-divider inset vertical class="ml-6"></v-divider>
                        <strong class="ml-4 text-h5 font-weight-bold">Oficios</strong>
                    </div>
                </div>
            </v-card-title>
            <v-container fluid>

                <v-data-table :search="buscar" :items="oficios" :headers="headers" :loading="loading" loading-text="Cargando datos..." no-data-text="Sin oficios registrados">
                    <template v-slot:top>
                        <v-row class="d-flex align-center justify-space-between">
                            <v-col cols="3">
                                <v-text-field density="comfortable" v-model="buscar" label="Buscar por cualquier campo"
                                    variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="auto">
                                <v-btn color="success" size="small" rounded="lg" @click="abrirDialogo()">Crear Oficio
                                </v-btn>
                            </v-col>
                        </v-row>
                    </template>

                    <template v-slot:[`item.acciones`]="{ item }">
                        <div>
                            <v-icon color="warning" icon="mdi-pencil" size="small" @click="abrirDialogoEditar(item)">
                            </v-icon>
                            <v-icon color="red" icon="mdi-delete" size="small" @click="eliminarOficio(item.id)">
                            </v-icon>
                        </div>
                    </template>

                    <template v-slot:[`item.created_at`]="{ item }">
                        <div>
                            {{item.created_at?.substring(0,10)}}
                        </div>
                    </template>
                </v-data-table>
            </v-container>

        </v-card>

        <v-dialog v-model="crearOficioDialog" max-width="900px" persistent>
            <v-card>
                <v-card-title>
                    <div class="d-flex align-center justify-space-between w-100">
                        <div class="d-flex align-center">
                            <img src="/public/imagenes/neuroar.png" alt="Logo" height="50px" width="50px">
                            <v-divider inset vertical class="ml-6"></v-divider>
                            <strong class="ml-4 text-h6 font-weight-bold">
                                {{ modoEdicion ? 'Editar Oficio' : 'Crear Oficio'}}</strong>
                        </div>
                    </div>
                </v-card-title>
                <v-card-text>
                    <v-form ref="formOficio">
                        <v-col>
                            <v-text-field :rules="CampoRequerido" variant="outlined" label="Nombre"
                                density="comfortable" v-model="oficio.nombre"></v-text-field>
                        </v-col>
                    </v-form>
                </v-card-text>
                <v-spacer></v-spacer>
                <v-card-actions>
                    <v-btn color="red" dark size="small" rounded="lg" variant="flat" @click="cerrarDialog()">
                        Cerrar
                    </v-btn>
                    <v-btn :color="modoEdicion ? 'warning' : 'success'" size="small" rounded="lg" variant="flat"
                        @click="modoEdicion ? actualizarOficio(oficio) : crearOficio()" :loading="loadingCrear">
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
                crearOficioDialog: false,
                oficio: {
                    nombre: '',
                },
                CampoRequerido: [
                    v => !!v || 'Nombre es requerido',
                ],
                loadingCrear: false,
                loading: false,
                buscar: '',
                oficios: [],
                headers: [{
                        title: 'id',
                        key: 'id',
                    },
                    {
                        title: 'Nombre',
                        key: 'nombre',
                    },
                    {
                        title: 'Fecha de creación',
                        key: 'created_at',
                    },
                    {
                        title: 'Acciones',
                        key: 'acciones',
                        align: 'center'
                    }
                ],
                modoEdicion: false,
            }
        },

        mounted() {
            this.listarOficios()
        },

        methods: {

            abrirDialogo() {
                this.modoEdicion = false
                this.crearOficioDialog = true;
            },

            async crearOficio() {
                const {
                    valid
                } = await this.$refs.formOficio.validate();
                if (!valid) return;
                this.loadingCrear = true;
                try {
                    await this.$axios.post('oficios/crear-oficio', this.oficio);
                    this.$toast.success('Oficio creado con éxito');
                    this.cerrarDialog();
                    this.listarOficios();
                } catch (error) {
                    console.error('Error al crear el oficio:', error);
                    this.$toast.error('Hubo un error al crear el oficio. Inténtelo nuevamente.');
                } finally {
                    this.loadingCrear = false;
                }
            },

            cerrarDialog() {
                this.oficio = {};
                this.crearOficioDialog = false
            },

            async listarOficios() {
                this.loading = true
                try {
                    const response = await this.$axios.get('oficios/listar');
                    this.oficios = response.data;
                } catch {
                    console.error('Error al obtener los oficios');
                } finally {
                    this.loading = false
                }
            },


            abrirDialogoEditar(item) {
                this.modoEdicion = true;
                this.oficio = {
                    ...item
                };
                this.crearOficioDialog = true;
            },

            async actualizarOficio(item) {
                this.loadingCrear = true;
                try {
                    await this.$axios.put('oficios/actualizar-oficio/' + item.id, item);
                    this.$toast.success('Oficio actualizado con éxito');
                    this.cerrarDialog();
                    this.listarOficios();
                } catch {
                    console.error('Error al actualizar el oficio');
                } finally {
                    this.loadingCrear = false
                }
            },

            async eliminarOficio(item) {
                const result = await this.$swal.fire({
                    title: '¿Estás seguro?',
                    text: 'No podrás deshacer esta acción.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar',
                });
                if (result.isConfirmed) {
                    this.$axios
                        .delete('oficios/eliminar-oficio/' + item)
                        .then(() => {
                            this.$toast.success('Oficio eliminado con éxito');
                            this.listarOficios();
                        })
                        .catch((error) => {
                            console.error('Error al eliminar el oficio', error);
                        });
                }
            },
        }
    }
</script>