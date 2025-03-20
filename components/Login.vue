<template>
    <v-app>
        <v-container class="full-height d-flex align-center justify-center">
            <v-form ref="formIncioSesion">
                <v-row>
                    <v-col cols="12">
                        <v-img src="/imagenes/neuroar.png" contain max-height="150" max-width="250"
                            class="mx-auto"></v-img>
                    </v-col>

                    <v-col cols="12" md="12">
                        <v-text-field label="Correo Electrónico" variant="outlined" prepend-inner-icon="mdi-email"
                            v-model="inicioSesion.email" :rules="[rules.required, rules.email]">
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="12" v-if="mostrarCampoClave">
                        <v-text-field label="Contraseña" :type="mostrarClave ? 'text' : 'password'" variant="outlined"
                            prepend-inner-icon="mdi-lock" :append-icon="mostrarClave ? 'mdi-eye-off' : 'mdi-eye'"
                            v-model="inicioSesion.password" @click:append="mostrarClave = !mostrarClave"
                            :rules="[rules.required, rules.min]">
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="12" v-if="mostrarNumeroDocumento">
                        <v-text-field label="Número de documento" variant="outlined"
                            v-model="inicioSesion.numero_documento"></v-text-field>
                    </v-col>

                    <!-- Botón de iniciar sesión -->
                    <v-col cols="12">
                        <v-btn color="blue" block @click="iniciarSesion()" :loading="loading">Iniciar Sesión</v-btn>
                    </v-col>

                    <!-- Botón para registrarse -->
                    <v-col cols="12">
                        <NuxtLink to="/registro">
                            <v-btn color="primary" variant="tonal" block>Registrarse</v-btn>
                        </NuxtLink>
                    </v-col>

                    <!-- Botones de redes sociales -->
                    <v-col cols="12" class="text-center">
                        <v-btn icon variant="text">
                            <v-icon color="AzulNeuro">mdi-facebook</v-icon>
                        </v-btn>
                        <v-btn icon variant="text">
                            <v-icon color="AzulNeuro">mdi-linkedin</v-icon>
                        </v-btn>
                        <v-btn icon variant="text">
                            <v-icon color="AzulNeuro">mdi-twitter</v-icon>
                        </v-btn>
                        <v-btn icon variant="text">
                            <v-icon color="AzulNeuro">mdi-instagram</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-container>
    </v-app>
</template>



<script>
import { useAuthStore } from '@/stores/auth'
export default {
    data() {
        return {
            mostrarCampoClave: false,
            mostrarClave: false,
            inicioSesion: {
                email: '',
                password: '',
                numero_documento: ''
            },
            loading: false,
            mostrarNumeroDocumento: false,
            rules: {
                required: value => !!value || 'Campo requerido',
                email: value => /.+@.+\..+/.test(value) || 'Correo inválido',
                min: value => (value && value.length >= 6) || 'Mínimo 6 caracteres'
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
                const response = await this.$axios.post("login", this.inicioSesion)

                const token = response.data.token
                const user = response.data.user

                // Guardar en Pinia y localStorage
                authStore.setUser(user, token)

                this.$toast.success("¡Sesión iniciada correctamente!")
                this.$router.push("/inicio")
            } catch (error) {
                const errorData = error.response.data

                if (error.response.status === 422) {
                    if (errorData.errors?.password) {
                        this.mostrarCampoClave = true
                    }
                    if (errorData.errors?.numero_documento) {
                        this.mostrarNumeroDocumento = true
                        this.mostrarCampoClave = true
                        return this.$toast.info("Se encontraron múltiples cuentas asociadas. Ingrese el número de documento.")
                    }
                }

                if (error.response.status === 401) {
                    this.mostrarCampoClave = true
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
        },

    }
}
</script>


<style>
.full-height {
    height: 100vh;
}
</style>