<template>
    <div class="d-flex justify-center align-center" style="min-height: 100vh; background-color: #f4f9ff;">
      <v-card class="pa-6" max-width="500" elevation="10" rounded="xl">
        <v-card-title class="justify-center">
          <div class="text-center">
            <v-img src="/imagenes/icono-logo.png" alt="Logo" max-width="80" class="mx-auto mb-4" />
            <h2 class="text-h5 font-weight-bold mb-2">Recuperación de Contraseña</h2>
            <p class="text-subtitle-2 text-grey-darken-1">Ingresa tu correo para recibir un enlace de recuperación</p>
          </div>
        </v-card-title>
  
        <v-card-text>
          <v-form ref="formValidacion" lazy-validation>
            <v-text-field
              v-model="email"
              label="Correo electrónico"
              :rules="[rules.requerido, rules.email]"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-email-outline"
              class="mb-4"
            />
            <v-btn
              block
              color="primary"
              variant="flat"
              @click="validarEmail"
              :loading="loading"
              size="large"
            >
              Enviar enlace de recuperación
            </v-btn>
          </v-form>
        </v-card-text>
  
        <v-card-actions class="justify-center mt-4">
          <small class="text-caption text-grey">
            Si no recibes el correo, revisa tu carpeta de spam.
          </small>
        </v-card-actions>
      </v-card>
    </div>
  </template>
  
  <script>
  definePageMeta({
    layout: 'empty',
  });
  
  export default {
    data() {
      return {
        email: '',
        loading: false,
        rules: {
          requerido: v => !!v || 'El campo es obligatorio',
          email: v => /.+@.+\..+/.test(v) || 'El correo no es válido',
        },
      };
    },
    methods: {
      async validarEmail() {
        const { valid } = await this.$refs.formValidacion.validate();
        if (!valid) return;
  
        this.loading = true;
        try {
          await this.$axios.post('/recuperar-contrasena', {
            email: this.email,
          });
          this.$toast.success(
            'Correo enviado correctamente. Revisa tu bandeja de entrada para recuperar tu contraseña.'
          );
        } catch {
          this.$toast.error('El correo registrado no existe');
        } finally {
          this.loading = false;
        }
      },
    },
  };
  </script>
  