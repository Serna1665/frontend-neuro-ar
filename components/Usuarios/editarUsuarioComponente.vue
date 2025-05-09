<template>
    <div>
        <v-card :loading="loading" :disabled="loading">
            <v-card-title>
                <div class="d-flex align-center justify-space-between w-100">
                    <div class="d-flex align-center">
                        <img src="/public/imagenes/icono-logo.png" alt="Logo" height="70px" width="70px">
                        <v-divider inset vertical class="ml-6"></v-divider>
                        <strong class="ml-4 text-h5 font-weight-bold">Editar Usuario # {{datosUsuarios?.id}}</strong>
                    </div>
                </div>
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="4">
                        <v-text-field label="Nombres" readonly density="comfortable" variant="outlined"
                            v-model="datosPaciente.nombres">
                        </v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field label="Apellidos" readonly density="comfortable" variant="outlined"
                            v-model="datosPaciente.apellidos">
                        </v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-autocomplete :items="['Masculino', 'Femenino', 'Otro']" label="Género" density="comfortable"
                            variant="outlined" v-model="datosPaciente.genero">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="4">
                        <v-autocomplete label="Oficio" variant="outlined" :items="oficios" item-title="nombre"
                            item-value="id" v-model="datosPaciente.oficio_id" density="comfortable">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field label="Fecha de nacimiento" readonly density="comfortable" variant="outlined"
                            v-model="datosPaciente.fecha_nacimiento">
                        </v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-autocomplete :items="['Diestro', 'Zurdo', 'Ambiestro']" label="Lateralidad dominante"
                            density="comfortable" variant="outlined" v-model="datosPaciente.lateralidad_dominante">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field label="Estatura" type="number" density="comfortable" variant="outlined"
                            v-model="datosPaciente.estatura">
                        </v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field type="number" label="Número de documento" density="comfortable" variant="outlined"
                            v-model="datosUsuarios.numero_documento">
                        </v-text-field>
                    </v-col>
                    <v-col cols="4" v-if="datosPaciente.municipio?.nombre">
                        <v-text-field readonly label="Municipio" density="comfortable" variant="outlined"
                            v-model="datosPaciente.municipio.nombre">
                        </v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-autocomplete label="Empresa" variant="outlined" :items="empresas" item-title="nombre"
                            item-value="id" v-model="datosPaciente.empresa_id" density="comfortable">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="4">
                        <v-autocomplete label="Sede" variant="outlined" :items="sedes" item-title="nombre"
                            item-value="id" v-model="datosPaciente.sede_id" density="comfortable"
                            :disabled="!datosPaciente.empresa_id" no-data-text="Sin sedes registradas">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="4">
                        <v-autocomplete label="Dependencias" variant="outlined" :items="dependencias" item-title="nombre"
                            item-value="id" v-model="datosPaciente.dependencia_id" density="comfortable"
                            :disabled="!datosPaciente.sede_id" no-data-text="Sin sedes registradas">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field label="Email" density="comfortable" variant="outlined"
                            v-model="datosUsuarios.email">
                        </v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field label="Contraseña" density="comfortable" variant="outlined"
                            v-model="datosUsuarios.password">
                        </v-text-field>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" dark size="small" variant="flat" @click="$emit('cerrarDialogo')">Cerrar</v-btn>
                <v-btn color="success" variant="flat" size="small" @click="actualizarPaciente()"
                    :loading="loadingActualizar">Actualizar</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
    export default {
        props: ['datosUsuarios'],
        data() {
            return {
                datosPaciente: [],
                oficios: [],
                loading: false,
                loadingActualizar: false,
                empresas: [],
                sedes: [],
                dependencias: []

            }
        },

        watch: {
            'datosPaciente.empresa_id'(nuevoValor) {
                if (nuevoValor) {
                    this.listarSedes();
                }
            },

            'datosPaciente.sede_id'(nuevoValor) {
                if (nuevoValor) {
                    this.obtenerDependenciasSede();
                }
            },
        },

        mounted() {
            this.listarOficios()
            this.listarEmpresas();
        },

        methods: {
            obtenerDatosUsuario() {
                this.loading = true;
                this.$axios.get('pacientes/datos-paciente/' + this.datosUsuarios.id).then((res) => {
                    this.datosPaciente = res.data
                }).catch((error) => {
                    console.log(error.response.data.error)
                }).finally(() => {
                    this.loading = false
                })
            },

            async listarOficios() {
                try {
                    const response = await this.$axios.get('oficios/listar');
                    this.oficios = response.data;
                } catch {
                    console.error('Error al obtener los oficios');
                }
            },

            async actualizarPaciente() {
                const data = {
                    user_id: this.datosUsuarios.id,
                    ...this.datosPaciente,
                    ...this.datosUsuarios
                }
                this.loadingActualizar = true;
                try {
                    const response = await this.$axios.put('/pacientes/actualizar-informacion', data);
                    this.$toast.success('Actualizado con éxito');
                    this.$emit('cerrarDialogo')
                    this.$emit('pacienteActualizado')
                } catch {
                    this.$toast.error('Error al actualizar paciente');
                } finally {
                    this.loadingActualizar = false;
                }
            },

            listarEmpresas() {
                this.$axios.get('/empresas/listarActivas').then((res) => {
                    this.empresas = res.data
                }).catch((error) => {
                    console.log(error.response.data.error)
                })
            },

            async listarSedes() {
                this.loading = true;
                try {
                    const response = await this.$axios.get(
                        `/sedes/listar-sede-empresa/${this.datosPaciente.empresa_id}`);
                    this.sedes = response.data;
                } catch (error) {
                    console.error('Error al obtener las sedes', error);
                } finally {
                    this.loading = false;
                }
            },

            obtenerDependenciasSede() {
                this.loading = true;
                this.$axios.get(`/sedes/listar-dependencias-sede/${this.datosPaciente.sede_id}`).then((res) => {
                    this.dependencias = res.data.dependencias;
                }).catch((error) => {
                    console.error(error);
                }).finally(() => {
                    this.loading = false;
                });
            }

        }

    }
</script>