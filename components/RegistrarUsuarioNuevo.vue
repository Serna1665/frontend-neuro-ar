<template>
    <div>
        <v-card class="pa-4">
            <v-card-title>
                <div class="d-flex align-center justify-space-between w-100">
                    <div class="d-flex align-center">
                        <img src="/public/imagenes/neuroar.png" alt="Logo" height="70px" width="70px" />
                        <v-divider inset vertical class="ml-6"></v-divider>
                        <strong class="ml-4 text-h5 font-weight-bold">Registro de usuarios</strong>
                    </div>
                    <v-btn icon color="primary" @click="$router.push('/'), limpiarFormulario()">
                        <v-icon>mdi-arrow-left</v-icon>
                    </v-btn>
                </div>
            </v-card-title>

            <v-col></v-col>
            <v-card-text></v-card-text>
            <v-container fluid>
                <v-form ref="formRegistroUsuario">
                    <v-row dense>
                        <!-- Campos básicos de usuario -->
                        <v-col cols="12" md="4">
                            <v-text-field hint="Ingresa tu número de identificación" label="Número de documento"
                                type="number" hide-spin-buttons variant="outlined" :rules="[rules.required]"
                                v-model="usuarioNuevo.numero_documento"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field label="Nombres" variant="outlined" :rules="[rules.required]"
                                v-model="usuarioNuevo.nombres"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field label="Apellidos" variant="outlined" :rules="[rules.required]"
                                v-model="usuarioNuevo.apellidos"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field label="Fecha de nacimiento" type="date" variant="outlined"
                                v-model="usuarioNuevo.fecha_nacimiento" :rules="[rules.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-autocomplete label="Género" variant="outlined" :items="['Masculino', 'Femenino', 'Otro']"
                                v-model="usuarioNuevo.genero" :rules="[rules.required]"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field label="Estatura" variant="outlined" type="number" hide-spin-buttons
                                hint="Ingresa tu estatura en centímetros" :rules="[rules.required]"
                                v-model="usuarioNuevo.estatura"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-autocomplete label="Lateralidad" variant="outlined"
                                :items="['Diestro', 'Zurdo', 'Ambiestro']" hint="Selecciona tu mano dominante"
                                :rules="[rules.required]" v-model="usuarioNuevo.lateralidad_dominante"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-autocomplete v-model="usuarioNuevo.oficio_id" :items="oficios" item-value="id"
                                item-title="nombre" label="Oficio" hint="Escribe al menos 4 letras" variant="outlined"
                                :rules="[rules.required]" :loading="loadingOficios" v-model:search="busquedaOficio"
                                @update:search="buscarOficios" hide-no-data hide-details="auto"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-autocomplete label="Empresa o entidad" variant="outlined" :items="['NeuroAr']"
                                hint="Selecciona la empresa o entidad a la que pertenece" :rules="[rules.required]"
                                v-model="usuarioNuevo.empresa_id"></v-autocomplete>
                        </v-col>
                        <!-- Campos de residencia -->
                        <v-col cols="12" md="4">
                            <v-autocomplete label="País de residencia" variant="outlined" :items="paises"
                                item-value="codigo_dane" item-title="nombre" hint="Selecciona el país"
                                :rules="[rules.required]" v-model="usuarioNuevo.pais_id"></v-autocomplete>
                        </v-col>
                        <v-autocomplete label="Departamento de residencia" variant="outlined" :items="departamentos"
                            item-value="id" item-title="nombre" hint="Selecciona su departamento"
                            :rules="[rules.required]" v-model="selectedDepartamento" :disabled="!usuarioNuevo.pais_id">
                        </v-autocomplete>
                        <v-col cols="12" md="4">
                            <v-autocomplete label="Municipio de residencia" variant="outlined" :items="municipios"
                                item-value="id" item-title="nombre" hint="Selecciona su municipio"
                                :rules="[rules.required]" v-model="usuarioNuevo.municipio_id"
                                :disabled="!usuarioNuevo.departamento_id"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field label="Correo electronico" type="email" variant="outlined"
                                v-model="usuarioNuevo.email" hint="Digite su correo electronico"
                                :rules="[rules.required, rules.email]"></v-text-field>
                        </v-col>
                        <!-- Campos complementarios -->
                        <v-col cols="12" md="4">
                            <v-switch color="primary" v-model="usuarioNuevo.usa_lentes" label="Usa lentes"></v-switch>
                        </v-col>
                    </v-row>
                </v-form>
            </v-container>
            <v-btn color="primary" block @click="registrarUsuarioNuevo()" :loading="loading">
                Registrar
            </v-btn>
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
            usuarioNuevo: {
                pais_id: null,
                departamento_id: null,
                municipio_id: null,
                numero_documento: '',
                nombres: '',
                apellidos: '',
                fecha_nacimiento: '',
                genero: '',
                estatura: '',
                lateralidad_dominante: '',
                oficio_id: null,
                empresa_id: '',
                email: '',
                usa_lentes: false,
            },
            selectedDepartamento: null,
            loading: false,
            oficios: [],
            paises: [],
            departamentos: [],
            municipios: [],
            busquedaOficio: '',
            loadingOficios: false,
            timeoutOficio: null,
        };
    },

    mounted() {
        this.listarPaises();
    },

    watch: {
        'usuarioNuevo.pais_id'(nuevoPais) {
            this.usuarioNuevo.departamento_id = null;
            this.selectedDepartamento = null;
            this.usuarioNuevo.municipio_id = null;
            this.departamentos = [];
            this.municipios = [];
            if (nuevoPais) {
                this.listarDepartamentos(nuevoPais);
            }
        },
        selectedDepartamento(nuevoDepartamento) {
            if (nuevoDepartamento) {
                this.usuarioNuevo.departamento_id = nuevoDepartamento;
                this.usuarioNuevo.municipio_id = null;
                this.municipios = [];
                this.listarMunicipios(nuevoDepartamento);
            } else {
                this.usuarioNuevo.departamento_id = null;
                this.usuarioNuevo.municipio_id = null;
                this.municipios = [];
            }
        }
    },

    methods: {
        async registrarUsuarioNuevo() {
            const { valid } = await this.$refs.formRegistroUsuario.validate();
            if (!valid) {
                return;
            }
            this.loading = true;
            try {
                const data = {
                    ...this.usuarioNuevo,
                    tipo_documento_id: 1,
                    empresa_id: 2,
                };
                const response = await this.$axios.post('/pacientes/crear', data);
                const usuario = response.data.usuario;
                this.limpiarFormulario();
                const result = await this.$swal.fire({
                    title: 'Usuario creado con éxito',
                    text: `Señor usuario, su correo de ingreso es: ${usuario.email} y su contraseña es: ${usuario.numero_documento}`,
                    icon: 'success',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#28a745'
                });
                if (result.isConfirmed) {
                    this.$router.push('/');
                }
            } catch (error) {
                this.$toast.error('Error al registrar usuario:', error.response?.data || error.message);
            } finally {
                this.loading = false;
            }
        },

        limpiarFormulario() {
            this.usuarioNuevo = {
                pais_id: null,
                departamento_id: null,
                municipio_id: null,
                numero_documento: '',
                nombres: '',
                apellidos: '',
                fecha_nacimiento: '',
                genero: '',
                estatura: '',
                lateralidad_dominante: '',
                oficio_id: null,
                empresa_id: '',
                email: ''
            };
            this.selectedDepartamento = null;
            this.departamentos = [];
            this.municipios = [];
        },

        buscarOficios(valor) {
            clearTimeout(this.timeoutOficio);

            if (!valor || valor.length < 4) {
                this.oficios = [];
                return;
            }

            this.timeoutOficio = setTimeout(async () => {
                this.loadingOficios = true;
                try {
                    const response = await this.$axios.get('/oficios/buscar', {
                        params: { q: valor }
                    });
                    this.oficios = response.data;
                } catch (error) {
                    console.error('Error al buscar oficios:', error);
                } finally {
                    this.loadingOficios = false;
                }
            }, 400);
        },


        async listarPaises() {
            this.loading = true;
            try {
                const response = await this.$axios.get('/paises/listar');
                this.paises = response.data;
            } catch (error) {
                console.error('Error al obtener los países', error);
            } finally {
                this.loading = false;
            }
        },

        async listarDepartamentos(paisCodigo) {
            this.loading = true;
            try {
                const response = await this.$axios.get(`departamentos/listar?pais=${paisCodigo}`);
                this.departamentos = response.data;
            } catch (error) {
                console.error('Error al obtener los departamentos', error);
            } finally {
                this.loading = false;
            }
        },

        async listarMunicipios(departamentoId) {
            this.loading = true;
            try {
                const response = await this.$axios.get(`municipios/listar/${departamentoId}`);
                console.log('Respuesta municipios:', response.data);
                this.municipios = response.data;
            } catch (error) {
                console.error('Error al obtener los municipios', error);
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>