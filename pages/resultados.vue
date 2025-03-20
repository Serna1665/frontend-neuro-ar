<template>
    <div>
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="12" class="text-center">
            <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
            <v-img v-else-if="imageUrl" :src="imageUrl" contain max-height="700"></v-img>
            <v-alert v-else type="error">No se pudo cargar la imagen.</v-alert>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </template>
  
  <script>
  export default {
    name: 'WorkspaceJsonResultados',
    data() {
      return {
        imageUrl: '',
        loading: true,
      };
    },
    mounted() {
      this.fetchImage();
    },
    methods: {
      async fetchImage() {
        try {
          const response = await this.$axios.post('/saludo', {
            clave_secreta: 'shrek',
            user_id: 13,
          });
  
  
          this.imageUrl = response.data.imagen;
        } catch (error) {
          console.error('Error al obtener la imagen:', error);
        } finally {
          this.loading = false;
        }
      },
      
    },
  };
  </script>