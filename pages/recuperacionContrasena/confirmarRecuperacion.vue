<template>
    <v-container class="d-flex justify-center align-center fill-height" style="background-color: #f4f9ff;">
      <v-card width="500" elevation="12" class="pa-6 rounded-xl">
        <v-card-title class="justify-center text-center flex-column mb-4">
          <v-img src="/imagenes/icono-logo.png" alt="Logo" max-width="80" class="mx-auto mb-2" />
          <h2 class="text-h6 font-weight-bold">Confirmar nueva contraseña</h2>
        </v-card-title>
  
        <v-card-text>
          <v-alert v-if="error" type="error" class="mb-4" border="start" variant="outlined" prominent>
            {{ error }}
          </v-alert>
  
          <v-alert v-if="success" type="success" class="mb-4" border="start" variant="outlined" prominent>
            {{ success }}
          </v-alert>
  
          <v-alert v-if="email" type="info" class="mb-4" border="start" variant="tonal" prominent>
            Cambiarás la contraseña para el correo: <strong>{{ email }}</strong>
          </v-alert>
  
          <v-form @submit.prevent="restablecerContrasena">
            <v-text-field
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              label="Nueva contraseña"
              variant="outlined"
              density="comfortable"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              class="mb-3"
              required
            />
  
            <v-text-field
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              label="Confirmar contraseña"
              variant="outlined"
              density="comfortable"
              :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showConfirmPassword = !showConfirmPassword"
              class="mb-4"
              required
            />
  
            <v-btn
              :loading="loading"
              type="submit"
              color="primary"
              block
              size="large"
            >
              Restablecer contraseña
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  const { $axios } = useNuxtApp();
  
  definePageMeta({
    layout: 'empty',
  });
  
  const route = useRoute();
  const router = useRouter();
  
  const token = ref(route.query.token || '');
  const email = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  const loading = ref(false);
  const error = ref('');
  const success = ref('');
  
  const showPassword = ref(false);
  const showConfirmPassword = ref(false);
  
  onMounted(async () => {
    if (!token.value) {
      error.value = 'Token faltante en la URL.';
      return;
    }
  
    try {
      const res = await $axios.post('/validar-token', { token: token.value });
      email.value = res.data.email;
    } catch (err) {
      error.value = err.response?.data?.message || 'Token inválido o expirado.';
    }
  });
  
  const restablecerContrasena = async () => {
    if (!token.value) {
      error.value = 'Token inválido';
      return;
    }
  
    if (password.value !== confirmPassword.value) {
      error.value = 'Las contraseñas no coinciden.';
      return;
    }
  
    loading.value = true;
    error.value = '';
    success.value = '';
  
    try {
      await $axios.post('/actualizar-contrasena', {
        token: token.value,
        password: password.value,
        password_confirmation: confirmPassword.value,
      });
  
      success.value = 'Contraseña actualizada correctamente. Serás redirigido al login.';
      setTimeout(() => router.push('/login'), 3000);
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al actualizar la contraseña.';
    } finally {
      loading.value = false;
    }
  };
  </script>
  
  <style scoped>
  .v-card {
    background-color: white;
  }
  </style>
  