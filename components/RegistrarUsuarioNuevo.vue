<template>
    <div>
        <v-card class="pa-4">
            <v-card-title>
                <div class="d-flex align-center justify-space-between w-100">
                    <div class="d-flex align-center">
                        <img src="/public/imagenes/neuroar.png" alt="Logo" height="70px" width="70px">
                        <v-divider inset vertical class="ml-6"></v-divider>
                        <strong class="ml-4 text-h5 font-weight-bold">Registro de usuarios</strong>
                    </div>

                    <v-btn icon color="red" @click="$router.push('/'), limpiarFormulario()">
                        <v-icon>mdi-arrow-left</v-icon>
                    </v-btn>
                </div>
            </v-card-title>


            <v-col></v-col>
            <v-card-text>

            </v-card-text>
            <v-container fluid>
                <v-form ref="formRegistroUsuario">
                    <v-row dense>
                        <v-col cols="12" md="4">
                            <v-text-field hint="Ingresa tu número de identificación" label="Número de documento"
                                type="number" hide-spin-buttons variant="outlined" :rules="[rules.required]" v-model="usuarioNuevo.numero_documento">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field label="Nombres" variant="outlined" :rules="[rules.required]" v-model="usuarioNuevo.nombres">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field label="Apellidos" variant="outlined" :rules="[rules.required]" v-model="usuarioNuevo.apellidos">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field label="Fecha de nacimiento" type="date" variant="outlined" v-model="usuarioNuevo.fecha_nacimiento"
                                :rules="[rules.required]">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-autocomplete label="Género" variant="outlined" :items="['Masculino', 'Femenino', 'Otro']" v-model="usuarioNuevo.genero"
                                :rules="[rules.required]">
                            </v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field label="Estatura" variant="outlined" type="number" hide-spin-buttons
                                hint="Ingresa tu estatura en centímetros" :rules="[rules.required]" v-model="usuarioNuevo.estatura">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-autocomplete label="Lateralidad" variant="outlined"
                                :items="['Diestro', 'Zurdo', 'Ambiestro']" hint="Selecciona tu mano dominante"
                                :rules="[rules.required]" v-model="usuarioNuevo.lateralidad_dominante">
                            </v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-autocomplete label="Oficio" variant="outlined" :items="oficios" item-value="id" item-title="nombre"
                                hint="Selecciona profesión" :rules="[rules.required]" v-model="usuarioNuevo.oficio_id">
                            </v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-autocomplete label="Empresa o entidad" variant="outlined" :items="['NeuroAr']"
                                hint="Selecciona la empresa o entidad a la que pertenece" :rules="[rules.required]" v-model="usuarioNuevo.empresa_id">
                            </v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-autocomplete label="Departamento de residencia" variant="outlined" :items="['Antioquia']"
                                hint="Selecciona su departamento de residencia" :rules="[rules.required]" v-model="usuarioNuevo.departamento_id">
                            </v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-autocomplete label="Municipio de residencia" variant="outlined" :items="['Caldas']"
                                hint="Selecciona su municipio de residencia" :rules="[rules.required]" v-model="usuarioNuevo.municipio_id">
                            </v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field label="Correo electronico" type="email" variant="outlined" v-model="usuarioNuevo.email"
                                hint="Digite su correo electronico" :rules="[rules.required, rules.email]">
                            </v-text-field>
                        </v-col>
                    </v-row>
                </v-form>
            </v-container>
            <v-btn color="blue" block @click="registrarUsuarioNuevo()" :loading="loading">Registrar</v-btn>
        </v-card>
    </div>
</template>

<script>
export default {
    name: 'WorkspaceJsonRegistrarUsuarioComponente',

    data() {
        return {
            rules: {
                required: value => !!value || 'Campo requerido',
                email: value => /.+@.+\..+/.test(value) || 'Correo inválido',
                min: value => (value && value.length >= 6) || 'Mínimo 6 caracteres'
            },
            usuarioNuevo: {},
            loading: false,
            oficios: []
        };
    },

    mounted() { 
        this.listarOficios()
    },

    methods: {

        async registrarUsuarioNuevo() {
            const { valid } = await this.$refs.formRegistroUsuario.validate()

            if (!valid) {
                return;
            }
            this.loading = true;

            try {
                const data = {
                    ...this.usuarioNuevo,
                    user_id: 1,
                    municipio_id: 1,
                    departamento_id: 1,
                    empresa_id: 2,
                    oficio_id:1,
                    tipo_documento_id: 1

                }
                const response = await this.$axios.post('/pacientes/crear', data);
                this.$toast.success("Usuario creado correctamente!");
                this.limpiarFormulario()
            } catch (error) {
                this.$toast.error('Error al registrar usuario:', error.response?.data || error.message);
            } finally {
                this.loading = false;
            }
        },

        limpiarFormulario() {
            this.usuarioNuevo = {}
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

    },
};
</script>