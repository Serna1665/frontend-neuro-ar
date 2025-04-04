<template>
    <div>
        <v-card>
            <v-card-title>
                <div class="d-flex align-center justify-space-between w-100">
                    <div class="d-flex align-center">
                        <img src="/public/imagenes/neuroar.png" alt="Logo" height="70px" width="70px">
                        <v-divider inset vertical class="ml-6"></v-divider>
                        <strong class="ml-4 text-h5 font-weight-bold">Empresas</strong>
                    </div>
                </div>
            </v-card-title>
            <v-container fluid>
                <v-data-table :search="buscar" :items="empresas" :headers="headers" :loading="loading"
                    loading-text="Cargando datos..." no-data-text="Sin empresas registradas">
                    <template v-slot:top>
                        <v-row class="d-flex align-center justify-space-between">
                            <v-col cols="6">
                                <v-text-field density="comfortable" v-model="buscar" label="Buscar por cualquier campo"
                                    variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="auto">
                                <v-btn color="success" size="small" rounded="lg" @click="abrirDialogo()">
                                    Crear Empresa
                                </v-btn>
                            </v-col>
                        </v-row>
                    </template>

                    <template v-slot:[`item.acciones`]="{ item }">
                        <div>
                            <v-icon color="warning" icon="mdi-pencil" size="small" @click="abrirDialogoEditar(item)">
                            </v-icon>
                            <v-icon color="red" icon="mdi-delete" size="small" @click="eliminarEmpresa(item.id)">
                            </v-icon>
                        </div>
                    </template>

                    <template v-slot:[`item.created_at`]="{ item }">
                        <div>
                            {{ item.created_at?.substring(0, 10) }}
                        </div>
                    </template>
                </v-data-table>
            </v-container>
        </v-card>

        <v-dialog v-model="crearEmpresaDialog" max-width="900px" persistent>
            <v-card>
                <v-card-title>
                    <div class="d-flex align-center justify-space-between w-100">
                        <div class="d-flex align-center">
                            <img src="/public/imagenes/neuroar.png" alt="Logo" height="50px" width="50px">
                            <v-divider inset vertical class="ml-6"></v-divider>
                            <strong class="ml-4 text-h6 font-weight-bold">
                                {{ modoEdicion ? 'Editar Empresa' : 'Crear Empresa' }}
                            </strong>
                        </div>
                    </div>
                </v-card-title>
                <v-card-text>
                    <v-form ref="formEmpresa">
                        <v-col>
                            <v-text-field :rules="CampoRequerido" variant="outlined" label="Nombre"
                                density="comfortable" v-model="empresa.nombre"></v-text-field>
                        </v-col>
                    </v-form>
                </v-card-text>
                <v-spacer></v-spacer>
                <v-card-actions>
                    <v-btn color="red" dark size="small" rounded="lg" variant="flat" @click="cerrarDialog()">
                        Cerrar
                    </v-btn>
                    <v-btn :color="modoEdicion ? 'warning' : 'success'" size="small" rounded="lg" variant="flat"
                        @click="modoEdicion ? actualizarEmpresa(empresa) : crearEmpresa()" :loading="loadingCrear">
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
            crearEmpresaDialog: false,
            empresa: {
                nombre: '',
            },
            CampoRequerido: [v => !!v || 'Nombre es requerido'],
            loadingCrear: false,
            loading: false,
            buscar: '',
            empresas: [],
            headers: [
                {
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
        };
    },

    mounted() {
        // this.listarEmpresas();
    },

    methods: {
        abrirDialogo() {
            this.modoEdicion = false;
            this.crearEmpresaDialog = true;
        },

        async crearEmpresa() {
            const { valid } = await this.$refs.formEmpresa.validate();
            if (!valid) return;
            this.loadingCrear = true;
            try {
                await this.$axios.post('empresas/crear-empresa', this.empresa);
                this.$toast.success('Empresa creada con éxito');
                this.cerrarDialog();
                this.listarEmpresas();
            } catch (error) {
                console.error('Error al crear la empresa:', error);
                this.$toast.error('Hubo un error al crear la empresa. Inténtelo nuevamente.');
            } finally {
                this.loadingCrear = false;
            }
        },

        cerrarDialog() {
            this.empresa = {};
            this.crearEmpresaDialog = false;
        },

        async listarEmpresas() {
            this.loading = true;
            try {
                const response = await this.$axios.get('empresas/listar');
                this.empresas = response.data;
            } catch {
                console.error('Error al obtener las empresas');
            } finally {
                this.loading = false;
            }
        },

        abrirDialogoEditar(item) {
            this.modoEdicion = true;
            this.empresa = { ...item };
            this.crearEmpresaDialog = true;
        },

        async actualizarEmpresa(item) {
            this.loadingCrear = true;
            try {
                await this.$axios.put('empresas/actualizar-empresa/' + item.id, item);
                this.$toast.success('Empresa actualizada con éxito');
                this.cerrarDialog();
                this.listarEmpresas();
            } catch {
                console.error('Error al actualizar la empresa');
            } finally {
                this.loadingCrear = false;
            }
        },

        async eliminarEmpresa(itemId) {
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
                    .delete('empresas/eliminar-empresa/' + itemId)
                    .then(() => {
                        this.$toast.success('Empresa eliminada con éxito');
                        this.listarEmpresas();
                    })
                    .catch(error => {
                        console.error('Error al eliminar la empresa', error);
                    });
            }
        },
    },
};
</script>