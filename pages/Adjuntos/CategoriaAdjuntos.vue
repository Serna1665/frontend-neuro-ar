<template>
    <div>
        <v-card>
            <v-card-title>
                <div class="d-flex align-center justify-space-between w-100">
                    <div class="d-flex align-center">
                        <img src="/public/imagenes/icono-logo.png" alt="Logo" height="70px" width="70px">
                        <v-divider inset vertical class="ml-6"></v-divider>
                        <strong class="ml-4 text-h5 font-weight-bold">Categoría Adjuntos</strong>
                    </div>
                </div>
            </v-card-title>

            <v-container fluid>

                <v-data-table :items="categorias" :headers="headers" :search="buscar" :loading="loading"
                    no-data-text="No hay datos" loading-text="Cargando...">
                    <template v-slot:top>
                        <v-row class="d-flex align-center justify-space-between">
                            <v-col cols="6">
                                <v-text-field density="comfortable" v-model="buscar" label="Buscar por cualquier campo"
                                    variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="auto">
                                <v-btn color="success" size="small" rounded="lg" @click="abrirDialogoCrear()">Crear
                                    Categoría Adjuntos
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

        <v-dialog v-model="dialogCategoria" max-width="600px" persistent>
            <v-card>
                <v-card-title>
                    <div class="d-flex align-center justify-space-between w-100">
                        <div class="d-flex align-center">
                            <img src="/public/imagenes/icono-logo.png" alt="Logo" height="50px" width="50px">
                            <v-divider inset vertical class="ml-6"></v-divider>
                            <strong
                                class="ml-4 text-h6 font-weight-bold">{{ modoEdicion ? 'Editar Categoría' : 'Crear Categoría' }}</strong>
                        </div>
                    </div>
                </v-card-title>
                <v-card-text>
                    <v-form ref="formCategoría">
                        <v-row dense>
                            <v-col>
                                <v-text-field :rules="[rules.required]" variant="outlined" label="Nombre"
                                    density="comfortable" v-model="nombre" hint="Ingrese el nombre de la categoría">
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="red" dark size="small" rounded="lg" variant="flat" @click="cerrarDialogo()">
                        Cerrar
                    </v-btn>
                    <v-btn size="small" :color="modoEdicion ? 'warning' : 'success'" rounded="lg" variant="flat"
                        @click="modoEdicion ? actualizarCategoria(nombre, id) : crearCategoria()" :loading="loadingCrear">
                        {{ modoEdicion ? 'Editar Categoría' : 'Crear Categoría'}}</v-btn>
                </v-card-actions>
            </v-card>

        </v-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                categorias: [],
                buscar: '', 
                loading: false,
                loadingCrear: false,
                modoEdicion: false,
                dialogCategoria: false,
                id: null,
                nombre: '',
                rules: {
                    required: value => !!value || 'Campo requerido',
                },
                headers: [{
                        title: 'ID',
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
                    }
                ]
            }
        },

        mounted() {
            this.listarCategoriasAdjuntos()
        },

        methods: {
            abrirDialogoCrear() {
                this.dialogCategoria = true;
                this.modoEdicion = false;
            },

            listarCategoriasAdjuntos() {
                this.loading = true
                this.$axios.get('categorias-adjuntos/listar').then((res) => {
                    this.categorias = res.data
                }).catch((error) => {
                    console.error(error.response.data.error)
                }).finally(() => {
                    this.loading = false
                })
            },

            async crearCategoria() {
                const {
                    valid
                } = await this.$refs.formCategoría.validate();
                if (!valid) return;
                try {
                    this.loadingCrear = true
                    const response = await this.$axios.post('categorias-adjuntos/crear', {
                        nombre: this.nombre
                    })
                    this.$toast.success('Categoría creada con éxito')
                    this.listarCategoriasAdjuntos()
                    this.cerrarDialogo()
                } catch (error) {
                    console.error(error.response.data.error)
                } finally {
                    this.loadingCrear = false
                }
            },
            cerrarDialogo() {
                this.dialogCategoria = false
                this.nombre = ''
            },

            abrirDialogoActualizar(item) {
                this.dialogCategoria = true
                this.modoEdicion = true
                this.nombre = item.nombre
                this.id = item.id
            },

            async actualizarCategoria(nombre, id) {
                const {
                    valid
                } = await this.$refs.formCategoría.validate();
                if (!valid) return;
                try {
                    this.loadingCrear = true
                    const response = await this.$axios.put(`categorias-adjuntos/actualizar/${id}`, {
                        nombre: nombre
                    })
                    this.$toast.success('Categoría actualizada con éxito')
                    this.listarCategoriasAdjuntos()
                    this.cerrarDialogo()
                } catch (error) {
                    this.$toast.error('Error al actualizar la categoría')
                    console.error(error.response)
                } finally {
                    this.loadingCrear = false
                }
            },
        },
    }
</script>

<style></style>