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

                    <!-- Estado con Chip -->
                    <template v-slot:[`item.estado_id`]="{ item }">
                        <v-chip :color="item.estado_id === 1 ? 'green' : 'red'" label variant="flat" size="small">
                            {{ item.estado_id === 1 ? 'Activo' : 'Inactivo' }}
                        </v-chip>
                    </template>

                    <!-- Botones de acciones -->
                    <template v-slot:[`item.acciones`]="{ item }">
                        <div class="d-flex gap-2">
                            <v-icon color="warning" icon="mdi-pencil" size="small"
                                @click="abrirDialogoEditar(item)"></v-icon>

                            <v-tooltip text="Cambiar estado">
                                <template #activator="{ props }">
                                    <v-icon v-bind="props" :color="item.estado_id === 1 ? 'red' : 'green'" size="small"
                                        :icon="item.estado_id === 1 ? 'mdi-toggle-switch-off' : 'mdi-toggle-switch'"
                                        @click="cambiarEstadoEmpresa(item.id, item.estado_id)">
                                    </v-icon>
                                </template>
                            </v-tooltip>
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
                            <v-text-field variant="outlined" label="NIT" density="comfortable"
                                v-model="empresa.nit"></v-text-field>
                            <v-text-field variant="outlined" label="Dirección" density="comfortable"
                                v-model="empresa.direccion"></v-text-field>
                            <v-text-field variant="outlined" label="Teléfono" density="comfortable"
                                v-model="empresa.telefono"></v-text-field>
                            <v-text-field variant="outlined" label="Email" density="comfortable"
                                v-model="empresa.email"></v-text-field>
                        </v-col>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="red" dark size="small" rounded="lg" variant="flat"
                        @click="cerrarDialog()">Cerrar</v-btn>
                    <v-btn :color="modoEdicion ? 'warning' : 'success'" size="small" rounded="lg" variant="flat"
                        @click="guardarEmpresa()" :loading="loadingCrear">Guardar</v-btn>
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
            empresa: { nombre: '', nit: '', direccion: '', telefono: '', email: '', estado_id: 1 },
            CampoRequerido: [v => !!v || 'Nombre es requerido'],
            loadingCrear: false,
            loading: false,
            buscar: '',
            empresas: [],
            headers: [
                { title: 'ID', key: 'id' },
                { title: 'Nombre', key: 'nombre' },
                { title: 'NIT', key: 'nit' },
                { title: 'Dirección', key: 'direccion' },
                { title: 'Teléfono', key: 'telefono' },
                { title: 'Email', key: 'email' },
                { title: 'Estado', key: 'estado_id', align: 'center' },
                { title: 'Acciones', key: 'acciones', align: 'center' }
            ],
            modoEdicion: false,
        };
    },

    mounted() {
        this.listarEmpresas();
    },

    methods: {
        abrirDialogo() {
            this.modoEdicion = false;
            this.empresa = { nombre: '', nit: '', direccion: '', telefono: '', email: '', estado_id: 1 };
            this.crearEmpresaDialog = true;
        },

        async listarEmpresas() {
            this.loading = true;
            try {
                const response = await this.$axios.get('/empresas/listarTodas');
                this.empresas = response.data;
            } catch (error) {
                console.error('Error al obtener las empresas:', error);
            } finally {
                this.loading = false;
            }
        },

        abrirDialogoEditar(item) {
            this.modoEdicion = true;
            this.empresa = { ...item };
            this.crearEmpresaDialog = true;
        },

        async guardarEmpresa() {
            this.loadingCrear = true;
            try {
                if (this.modoEdicion) {
                    await this.$axios.put(`/empresas/actualizar-empresa/${this.empresa.id}`, this.empresa);
                } else {
                    await this.$axios.post('/empresas/crear-empresa', this.empresa);
                }
                this.$toast.success('Operación exitosa');
                this.cerrarDialog();
                this.listarEmpresas();
            } catch (error) {
                console.error('Error al guardar la empresa:', error);
            } finally {
                this.loadingCrear = false;
            }
        },

        async cambiarEstadoEmpresa(id, estadoActual) {
            const nuevoEstado = estadoActual === 1 ? 'inactivada' : 'activada';
            try {
                await this.$axios.put(`/empresas/cambiar-estado/${id}`);
                this.$toast.success(`Empresa ${nuevoEstado} correctamente`);
                this.listarEmpresas();
            } catch (error) {
                console.error('Error al cambiar estado de la empresa:', error);
                this.$toast.error('Error al cambiar el estado');
            }
        },

        cerrarDialog() {
            this.crearEmpresaDialog = false;
        }
    }
};
</script>