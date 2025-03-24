import Swal from 'sweetalert2';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(() => {
  return {
    provide: {
      swal: Swal, 
    },
  };
});
