<template>
    <div>
        <v-card>
            <v-card-title>
                <div class="d-flex align-center justify-space-between w-100">
                    <div class="d-flex align-center">
                        <img src="/public/imagenes/icono-logo.png" alt="Logo" height="70px" width="70px">
                        <v-divider inset vertical class="ml-6"></v-divider>
                        <strong class="ml-4 text-h5 font-weight-bold">Tipo Adjuntos</strong>
                    </div>
                </div>
            </v-card-title>

            <v-container fluid>
                <v-data-table :items="tipoAdjuntos" :headers="headers" :search="buscar" :loading="loading">
                    <template v-slot:top>
                        <v-row class="d-flex align-center justify-space-between">
                            <v-col cols="6">
                                <v-text-field density="comfortable" v-model="buscar" label="Buscar por cualquier campo"
                                    variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="auto">
                                <v-btn color="success" size="small" rounded="lg" @click="abrirDialogoCrear()">Crear
                                    Tipo Adjuntos
                                </v-btn>
                            </v-col>
                        </v-row>
                    </template>

                    <template v-slot:[`item.created_at`]="{ item }">
                        <div>
                            {{ item.created_at?.substring(0, 10) }}
                        </div>
                    </template>

                    <template v-slot:[`item.acciones`]="{ item }">
                        <v-tooltip location="top">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" color="warning" icon="mdi-pencil" size="small"
                                    @click="abrirDialogoActualizar(item)">
                                </v-icon>
                            </template>
                            <span>Editar Categoria</span>
                        </v-tooltip>

                    </template>
                </v-data-table>
            </v-container>
        </v-card>

        <v-dialog v-model="dialogTipoAdjunto" max-width="900px" persistent>
            <v-card>
                <v-card-title>
                    <div class="d-flex align-center justify-space-between w-100">
                        <div class="d-flex align-center">
                            <img src="/public/imagenes/icono-logo.png" alt="Logo" height="50px" width="50px">
                            <v-divider inset vertical class="ml-6"></v-divider>
                            <strong
                                class="ml-4 text-h6 font-weight-bold">{{ modoEdicion ? 'Editar Tipo Adjunto' : 'Crear Tipo Adjunto' }}</strong>
                        </div>
                    </div>
                </v-card-title>
                <v-card-text>
                    <v-form ref="formTipoAdjunto">
                        <v-row dense>
                            <v-col>
                                <v-text-field :rules="[rules.required]" variant="outlined" label="Nombre"
                                    density="comfortable" v-model="tipoAdjunto.nombre" hint="Ingrese el nombre de la categoría">
                                </v-text-field>
                            </v-col>
                            <v-col>
                                <v-autocomplete :rules="[rules.required]" variant="outlined" label="Categoría"
                                    density="comfortable" v-model="tipoAdjunto.categoria_adjunto_id" :items="categorias" item-title="nombre" item-value="id" hint="Ingrese el nombre de la categoría">
                                </v-autocomplete>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="red" dark size="small" rounded="lg" variant="flat" @click="cerrarDialogo()">
                        Cerrar
                    </v-btn>
                    <v-btn size="small" :color="modoEdicion ? 'warning' : 'success'" rounded="lg" variant="flat"
                        @click="modoEdicion ? actualizarAdjunto(tipoAdjunto) : crearTipoAdjunto()" :loading="loadingCrear">
                        {{ modoEdicion ? 'Editar Tipo Adjunto' : 'Crear Tipo Adjunto'}}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                loading: false,
                loadingCrear: false,
                tipoAdjuntos: [],
                buscar: '',
                modoEdicion: false,
                dialogTipoAdjunto: false,
                rules: {
                    required: value => !!value || 'Campo requerido',
                },
                tipoAdjunto: {
                    nombre: null,
                    categoria_adjunto_id: null,
                },
                categorias: [], 
                headers: [{
                        title: 'ID',
                        key: 'id',
                    },
                    {
                        title: 'Nombre',
                        key: 'nombre',
                    },
                    {
                        title: 'Categoria',
                        key: 'categoria_adjunto.nombre',
                    },
                    {
                        title: 'Fecha de Creación',
                        key: 'created_at',
                    },
                    {
                        title: 'Acciones',
                        key: 'acciones',
                        sortable: false,
                    }
                ]
            }
        },
        mounted() {
            this.listarTipoAdjuntos();
            this.listarCategorias();
        },
        methods: {
            listarTipoAdjuntos() {
                this.loading = true
                this.$axios.get('tipo-adjuntos/listar').then((response) => {
                    this.tipoAdjuntos = response.data;
                }).catch((error) => {
                    console.error(error);
                }).finally(() => {
                    this.loading = false
                })
            },

            abrirDialogoCrear() {
                this.dialogTipoAdjunto = true;
                this.modoEdicion = false;
            },
            abrirDialogoActualizar(item) {
                this.dialogTipoAdjunto = true
                this.modoEdicion = true;
                this.tipoAdjunto = {...item}
            },

            listarCategorias() {
                this.loading = true
                this.$axios.get('categorias-adjuntos/listar').then((res) => {
                    this.categorias = res.data
                }).catch((error) => {
                    console.error(error.response.data.error)
                }).finally(() => {
                    this.loading = false
                })
            },

            async crearTipoAdjunto()
            {
                const {
                    valid
                } = await this.$refs.formTipoAdjunto.validate();
                if (!valid) return;
                try {
                    this.loadingCrear = true
                    const response = await this.$axios.post('tipo-adjuntos/crear', {
                        nombre: this.tipoAdjunto.nombre,
                        categoria_adjunto_id: this.tipoAdjunto.categoria_adjunto_id,
                    })
                    this.$toast.success('Tipo Adjunto creado con éxito')
                    this.listarTipoAdjuntos()
                    this.cerrarDialogo()
                } catch (error) {
                    console.error(error.response.data.error)
                } finally {
                    this.loadingCrear = false
                }
            },

            cerrarDialogo() {
                this.dialogTipoAdjunto = false
                this.tipoAdjunto.nombre = ''
                this.tipoAdjunto.categoria_adjunto_id = null
            },

            async actualizarAdjunto(item)
            {
                const {
                    valid
                } = await this.$refs.formTipoAdjunto.validate();
                if (!valid) return;
                try {
                    this.loadingCrear = true
                    const response = await this.$axios.put(`tipo-adjuntos/actualizar/${item.id}`, {
                        nombre: this.tipoAdjunto.nombre,
                        categoria_adjunto_id: this.tipoAdjunto.categoria_adjunto_id,
                    })
                    this.$toast.success('Tipo Adjunto actualizado con éxito')
                    this.listarTipoAdjuntos()
                    this.cerrarDialogo()
                } catch (error) {
                    console.error(error.response.data.error)
                } finally {
                    this.loadingCrear = false
                }
            }
        },
    }
</script>

<style>

</style>