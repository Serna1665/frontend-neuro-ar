<template>
    <div>
        <v-card class="pa-6" elevation="4" rounded="2xl" :loading="loading" :disabled="loading">
            <v-card-title class="pb-6">
                <div class="d-flex align-center justify-space-between w-100">
                    <div class="d-flex align-center">
                        <v-img src="/imagenes/icono-logo.png" height="70" width="70" contain />
                        <v-divider vertical class="mx-6" />
                        <span class="text-h5 font-weight-bold">Actualización de datos personales</span>
                    </div>
                </div>
            </v-card-title>

            <v-card-text>
                <v-form ref="form">
                    <v-row dense>
                        <v-col cols="12" md="4">
                            <v-text-field label="Nombre" variant="outlined" density="comfortable"
                                v-model="datosPaciente.nombres" :rules="[rules.required]" />
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-text-field label="Apellido" variant="outlined" density="comfortable"
                                v-model="datosPaciente.apellidos" :rules="[rules.required]" />
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-text-field label="Número de documento" variant="outlined" density="comfortable"
                                v-model="datosPaciente.numero_documento" :rules="[rules.required, rules.numeric]" />
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-text-field label="Email" variant="outlined" density="comfortable"
                                v-model="datosPaciente.user.email" :rules="[rules.required, rules.email]" />
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-text-field label="Contraseña" type="password" variant="outlined" density="comfortable"
                                v-model="datosPaciente.password" :rules="[rules.min(6)]" />
                        </v-col>
                    </v-row>

                    <v-row justify="end" class="mt-6">
                        <v-col cols="auto">
                            <v-btn color="primary" rounded="xl" @click="guardarDatos" :loading="loading">
                                Guardar Cambios
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>


<script>
import { useAuthStore } from '@/stores/auth';

export default {
    data() {
        return {
            datosPaciente: {
                nombres: '',
                apellidos: '',
                numero_documento: '',
                password: '',
                user: {
                    email: ''
                }
            },
            rules: {
                required: v => !!v || 'Este campo es obligatorio',
                email: v => /.+@.+\..+/.test(v) || 'Correo inválido',
                numeric: v => /^[0-9]+$/.test(v) || 'Debe ser numérico',
                min: min => v => (!v || v.length >= min) || `Mínimo ${min} caracteres`
            },
            loading: false
        };
    },

    mounted() {
        this.obtenerDatosUsuario();
    },

    methods: {
        obtenerDatosUsuario() {
            const authStore = useAuthStore();
            const userId = authStore.user?.id;
            this.loading = true;

            this.$axios
                .get('pacientes/datos-paciente/' + userId)
                .then(res => {
                    this.datosPaciente = res.data;
                })
                .catch(error => {
                    console.error(error.response?.data?.error || error.message);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        async guardarDatos() {
            const { valid } = await this.$refs.form.validate();

            if (!valid) {
                this.$toast.error('Por favor completa todos los campos requeridos correctamente.');
                return;
            }
            this.loading = true;
            this.$axios
                .post('/actualizar-datos-personales', this.datosPaciente)
                .then(() => {
                    this.$toast.success('Datos actualizados con éxito');
                })
                .catch((error) => {
                    console.error(error);
                    this.$toast.error('Ocurrió un error al guardar los datos');
                })
                .finally(() => {
                    this.loading = false;
                });
        }

    }
};
</script>