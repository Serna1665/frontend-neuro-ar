<template>
    <v-app>
        <v-container fluid class="full-height pa-0 d-none d-md-flex">
            <v-row class="full-height ma-0" align="stretch" justify="center" dense>
                <v-col cols="4" class="left-col pa-0 position-relative">
                    <div class="semi-circulo"></div>
                    <div class="crear-cuenta">
                        <h2 class="text-h5 font-weight-bold">¿No tienes cuenta?</h2>
                        <p>Únete a NeuroAR en segundos.</p>
                        <NuxtLink to="/registro" class="boton-crear-cuenta">
                            <v-btn color="white" variant="tonal" block>
                                Crear cuenta
                            </v-btn>
                        </NuxtLink>
                    </div>
                    <v-img src="/imagenes/andres_login.png" alt="Hombre con VR" :height="'100%'"
                        class="hombre-img"></v-img>
                </v-col>

                <v-col cols="12" md="4" class="pa-0 d-flex align-center justify-center centrado-formulario">
                    <v-form ref="formIncioSesion" class="formulario-login">
                        <v-row class="d-flex flex-column align-center" dense>
                            <v-col cols="12" class="text-center">
                                <v-img src="/imagenes/neuroar.png" alt="Logo NeuroAR" contain max-height="100"
                                    max-width="200" class="mx-auto"></v-img>
                            </v-col>

                            <!-- Campo: Correo Electrónico -->
                            <v-col cols="12">
                                <v-text-field label="Correo Electrónico" variant="outlined"
                                    prepend-inner-icon="mdi-account-outline" v-model="inicioSesion.email" rounded
                                    :rules="[rules.required, rules.email]">
                                </v-text-field>
                            </v-col>

                            <!-- Campo: Contraseña -->
                            <v-col cols="12">
                                <v-text-field label="Contraseña" :type="mostrarClave ? 'text' : 'password'"
                                    variant="outlined" rounded prepend-inner-icon="mdi-lock-outline"
                                    :append-icon="mostrarClave ? 'mdi-eye-off' : 'mdi-eye'"
                                    v-model="inicioSesion.password" @click:append="mostrarClave = !mostrarClave"
                                    :rules="[rules.required, rules.min]">
                                </v-text-field>
                            </v-col>

                            <!-- Campo: Número de Documento (Solo si es necesario) -->
                            <v-col cols="12" v-if="mostrarNumeroDocumento">
                                <v-text-field label="Número de Documento" variant="outlined"
                                    prepend-inner-icon="mdi-card-account-details"
                                    v-model="inicioSesion.numero_documento" rounded
                                    :rules="[rules.required, rules.documento]">
                                </v-text-field>
                            </v-col>

                            <!-- Enlace: Olvidé mi contraseña -->
                            <v-col cols="12" class="text-center">
                                <NuxtLink to="/recuperar" class="text-caption">
                                    ¿Has olvidado tu contraseña?
                                </NuxtLink>
                            </v-col>

                            <!-- Botón: Ingresar -->
                            <v-col cols="12" class="text-center">
                                <v-btn color="blue" rounded="lg" @click="iniciarSesion" :loading="loading">
                                    Ingresar
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-col>

                <!-- Columna Derecha: Niño -->
                <v-col cols="4" class="right-col pa-0 d-flex align-center justify-center">
                    <v-img class="nino-img" src="/imagenes/nino_login.png" alt="Niño con VR" :height="'100%'"></v-img>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script>
import { useAuthStore } from '@/stores/auth'

export default {
    data() {
        return {
            mostrarClave: false,
            mostrarNumeroDocumento: false,
            inicioSesion: {
                email: '',
                password: '',
                numero_documento: ''
            },
            loading: false,
            rules: {
                required: value => !!value || 'Campo requerido',
                email: value => /.+@.+\..+/.test(value) || 'Correo inválido',
                min: value => (value && value.length >= 6) || 'Mínimo 6 caracteres',
                documento: value => /^\d+$/.test(value) || 'Número de documento inválido'
            }
        }
    },
    methods: {
        async iniciarSesion() {
            const authStore = useAuthStore()
            const { valid } = await this.$refs.formIncioSesion.validate()

            if (!valid) return

            this.loading = true
            try {
                const response = await this.$axios.post('login', this.inicioSesion)
                const token = response.data.token
                const user = response.data.user

                authStore.setUser(user, token)
                this.$router.push('/inicio')
                this.$toast.success('¡Sesión iniciada correctamente!')
            } catch (error) {
                const errorData = error.response?.data

                if (error.response.status === 422) {
                    if (errorData.errors?.password) {
                        this.mostrarClave = true
                    }
                    if (errorData.errors?.numero_documento) {
                        this.mostrarNumeroDocumento = true
                        this.mostrarClave = true
                        return this.$toast.info("Se encontraron múltiples cuentas asociadas. Ingrese el número de documento.")
                    }
                }

                if (error.response.status === 401) {
                    this.mostrarClave = true
                    return this.$toast.error("Usuario o contraseña incorrecta.")
                }

                if (error.response.status === 404) {
                    this.$router.push('/registro')
                    return this.$toast.error("Usuario no encontrado.")
                }

                if (error.response.status === 400) {
                    return this.$toast.error("Número de documento o contraseña incorrectos.")
                }

                console.error(error.response.data)
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

<style scoped>
.full-height {
    height: 100vh;
    background: #f5f5f5;
}

.left-col,
.right-col {
    overflow: hidden;
}

.semi-circulo {
    position: absolute;
    left: -100px;
    top: -80%;
    width: 500px;
    height: 1200px;
    background: radial-gradient(circle, #0066cc, #003366);
    border-radius: 140%;
    z-index: 1;
}

.crear-cuenta {
    position: absolute;
    top: 20px;
    left: 70px;
    z-index: 30;
    color: white;
    background: rgba(0, 102, 204, 0.7);
    padding: 10px 40px;
    border-radius: 8px;
}

.formulario-login {
    width: 100%;
    max-width: 400px;
    padding: 30px;
    border-radius: 15px;
    box-shadow: none !important;
    background: #f5f5f5 !important;
}

.centrado-formulario {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.hombre-img {
    left: -150px;
    top: 60%;
    transform: translateY(-50%) scale(2.0);
    z-index: 10;
}

.nino-img {
    position: relative;
    left: -105px;
    top: 60%;
    transform: translateY(-50%) scale(2.1);
    z-index: 10;
}

.boton-crear-cuenta {
    text-decoration: none;
}

.boton-crear-cuenta .v-btn {
    border: 2px solid white;
    background: rgba(0, 102, 204, 0.5);
    color: white;
    font-weight: bold;
}

.boton-crear-cuenta .v-btn:hover {
    background: rgba(0, 102, 204, 0.8);
}
</style>
