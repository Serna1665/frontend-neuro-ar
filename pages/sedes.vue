<template>
    <div>
        <v-card>
            <v-card-title>
                <div class="d-flex align-center justify-space-between w-100">
                    <div class="d-flex align-center">
                        <img src="/public/imagenes/icono-logo.png" alt="Logo" height="70px" width="70px">
                        <v-divider inset vertical class="ml-6"></v-divider>
                        <strong class="ml-4 text-h5 font-weight-bold">Sedes</strong>
                    </div>
                </div>
            </v-card-title>

            <v-container fluid>
                <v-data-table :items="sedesCargadas" :headers="headers" :search="buscar" :loading="loadingListar"
                    loading-text="Cargando datos..." no-data-text="Sin oficios registrados">
                    <template v-slot:top>
                        <v-row class="d-flex align-center justify-space-between">
                            <v-col cols="6">
                                <v-text-field density="comfortable" v-model="buscar" label="Buscar por cualquier campo"
                                    variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="auto">
                                <v-btn color="success" size="small" rounded="lg" @click="abrirDialogo()">Crear Sedes
                                </v-btn>
                            </v-col>
                        </v-row>
                    </template>

                    <template v-slot:[`item.created_at`]="{ item }">
                        <div>
                            {{item.created_at?.substring(0,10)}}
                        </div>
                    </template>

                    <template v-slot:[`item.estado_id`]="{ item }">
                        <v-chip :color="item.estado_id == 1 ? 'green' : 'red'" label variant="flat" size="small">
                            {{ item.estado_id == 1 ? 'Activo' : 'Inactivo' }}</v-chip>
                    </template>

                    <template v-slot:[`item.acciones`]="{ item }">
                        <v-tooltip location="top">
                            <template v-slot:activator="{ props }" v-if="item.estado_id == 1">
                                <v-icon v-bind="props" color="warning" icon="mdi-pencil" size="small"
                                    @click="abrirDialogoEditar(item)">
                                </v-icon>
                            </template>
                            <span>Editar Sede</span>
                        </v-tooltip>
                        <v-tooltip location="top">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" :color="item.estado_id === 1 ? 'green' : 'red'"
                                    icon="mdi-toggle-switch" size="small" @click="cambiarEstado(item.id)"
                                    style="cursor: pointer">
                                </v-icon>
                            </template>
                            <span>{{ item.estado_id === 1 ? 'Inactivar' : 'Activar' }}</span>
                        </v-tooltip>

                        <v-tooltip location="top">
                            <template v-slot:activator="{ props }" v-if="item.estado_id == 1">
                                <v-icon v-bind="props" color="primary" icon="mdi-file-document-multiple-outline" size="small"
                                    @click="abrirDialogoAsignarDependencias(item)">
                                </v-icon>
                            </template>
                            <span>Asignar dependencias</span>
                        </v-tooltip>

                    </template>
                </v-data-table>
            </v-container>

        </v-card>


        <v-dialog v-model="sedesDialog" max-width="900px" persistent>
            <v-card>
                <v-card-title>
                    <div class="d-flex align-center justify-space-between w-100">
                        <div class="d-flex align-center">
                            <img src="/public/imagenes/icono-logo.png" alt="Logo" height="50px" width="50px">
                            <v-divider inset vertical class="ml-6"></v-divider>
                            <strong
                                class="ml-4 text-h6 font-weight-bold">{{ modoEdicion ? 'Editar Sede' : 'Crear Sede' }}</strong>
                        </div>
                    </div>
                </v-card-title>
                <v-card-text>
                    <v-form ref="formSedes">
                        <v-row dense>
                            <v-col cols="12" md="4" sm="4">
                                <v-text-field :rules="[rules.required]" variant="outlined" label="Nombre"
                                    density="comfortable" v-model="sedes.nombre"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4" sm="4">
                                <v-text-field :rules="[rules.required]" variant="outlined" label="Dirección"
                                    density="comfortable" v-model="sedes.direccion"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4" sm="4">
                                <v-text-field :rules="[rules.required]" type="number" variant="outlined"
                                    label="Telefono" density="comfortable" v-model="sedes.telefono"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4" sm="4">
                                <v-text-field :rules="[rules.required, rules.email]" variant="outlined" label="Correo"
                                    density="comfortable" v-model="sedes.correo"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4" sm="4">
                                <v-autocomplete :rules="[rules.required]" variant="outlined" label="Empresas"
                                    :loading="loadingEmpresas" density="comfortable" v-model="sedes.empresa_id"
                                    :items="empresas" item-title="nombre" item-value="id"></v-autocomplete>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="red" dark size="small" rounded="lg" variant="flat" @click="cerrarDialogo()">
                        Cerrar
                    </v-btn>
                    <v-btn size="small" :color="modoEdicion ? 'warning' : 'success'" rounded="lg" variant="flat"
                        @click="modoEdicion ? actualizarSede(sedes) : crearSede()" :loading="loadingCrear">
                        {{ modoEdicion ? 'Editar Sede' : 'Crear Sede'}}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="asignarDependenciaDialog" max-width="900px" persistent>
            <v-card>
                <asignarDepedencia :sedes="sedeSeleccionada" @cerrarDialogo="asignarDependenciaDialog = false"></asignarDepedencia>
            </v-card>
        </v-dialog>

    </div>
</template>

<script>
    import asignarDepedencia from "@/components/Sedes/asignarDependenciasSede.vue"
    export default {
        components: {
            asignarDepedencia
        },
        data() {
            return {
                buscar: '',
                sedesDialog: false,
                loadingCrear: false,
                loadingListar: false,
                loadingEmpresas: false,
                sedesCargadas: [],
                empresas: [],
                asignarDependenciaDialog: false,
                sedeSeleccionada: {},
                sedes: {
                    nombre: '',
                    direccion: '',
                    telefono: '',
                    correo: '',
                    empresa_id: '',
                    estado_id: 1,
                },
                headers: [{
                        title: 'id',
                        key: 'id',
                    },
                    {
                        title: 'Nombre',
                        key: 'nombre',
                    },
                    {
                        title: 'Dirección',
                        key: 'direccion',
                    },
                    {
                        title: 'Teléfono',
                        key: 'telefono',
                    },
                    {
                        title: 'Correo',
                        key: 'correo',
                    },
                    {
                        title: 'Empresa',
                        key: 'empresa.nombre',
                    },
                    {
                        title: 'Estado',
                        key: 'estado_id',
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
                rules: {
                    required: value => !!value || 'Campo requerido',
                    email: value => /.+@.+\..+/.test(value) || 'Correo inválido',
                },
                modoEdicion: false,
            }
        },

        mounted() {
            this.listarSedes();
            this.listarEmpresas();
        },

        methods: {
            abrirDialogo() {
                this.modoEdicion = false
                this.sedesDialog = true;
            },

            cerrarDialogo() {
                this.sedes = {}
                this.sedesDialog = false;
            },

            async crearSede() {
                const {
                    valid
                } = await this.$refs.formSedes.validate();
                if (!valid) return;
                this.loadingCrear = true;
                try {
                    await this.$axios.post('/sedes/crear', this.sedes);
                    this.sedesDialog = false;
                    this.$toast.success('Sede creada con éxito');
                    this.cerrarDialogo();
                    this.listarSedes();
                } catch {
                    this.$toast.error('Error al crear la sede')
                    console.error(error)

                } finally {
                    this.loadingCrear = false;
                }
            },

            listarSedes() {
                this.loadingListar = true;
                this.$axios.get('/sedes/listar').then((res) => {
                    this.sedesCargadas = res.data
                }).catch((error) => {
                    this.$toast.error('Error al listar las sedes')
                    console.error(error)
                }).finally(() => {
                    this.loadingListar = false;
                })
            },

            abrirDialogoEditar(item) {
                this.modoEdicion = true;
                this.sedes = {
                    ...item
                };
                this.sedesDialog = true;
            },

            actualizarSede(item) {
                this.loadingCrear = true;
                this.$axios.put('/sedes/actualizar/' + item.id, item).then(() => {
                    this.sedesDialog = false;
                    this.$toast.success('Sede actualizada con éxito');
                    this.cerrarDialogo();
                    this.listarSedes();
                }).catch((error) => {
                    this.$toast.error('Error al actualizar la sede')
                    console.error(error)
                }).finally(() => {
                    this.loadingCrear = false;
                })
            },

            listarEmpresas() {
                this.loadingEmpresas = true;
                this.$axios.get('/empresas/listarActivas').then((res) => {
                    this.empresas = res.data
                }).catch((error) => {
                    this.$toast.error('Error al listar las empresas')
                    console.error(error)
                }).finally(() => {
                    this.loadingEmpresas = false;
                })
            },

            async cambiarEstado(item) {
                const result = await this.$swal.fire({
                    title: '¿Estás seguro?',
                    text: 'Cambiaras el estado de esta sede.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: "#22bb33",
                    confirmButtonText: 'Sí, cambiar estado',
                    cancelButtonColor: "#d33",
                    cancelButtonText: 'Cancelar',

                });
                if (result.isConfirmed) {
                    this.$axios.post('/sedes/cambiar-estado/' + item)
                        .then(() => {
                            this.$toast.success('Estado cambiado con éxito');
                            this.listarSedes();
                        })
                        .catch((error) => {
                            console.error('Error al cambiar el estado', error);
                        });
                }
            },

            abrirDialogoAsignarDependencias(item) {
                this.sedeSeleccionada = item
                this.asignarDependenciaDialog = true;
            }
        },
    }
</script>