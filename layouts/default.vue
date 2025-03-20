<template>
    <v-app>
        <!-- Menú lateral -->
        <v-navigation-drawer v-model="drawer" app floating class="elevation-1" width="260">
            <v-col cols="12" class="d-flex justify-center">
                <v-img src="/imagenes/icono-logo.png" contain max-height="150" max-width="250"></v-img>
            </v-col>

            <v-list>
                <template v-for="item in menu" :key="item.title">
                    <v-list-group v-if="item.children && item.children.length" :value="isActive(item)">
                        <template v-slot:activator="{ props }">
                            <v-list-item v-bind="props">
                                <template v-slot:prepend>
                                    <v-icon color="AzulNeuro">{{ item.icon }}</v-icon>
                                </template>
                                <v-list-item-title class="text-subtitle-1 font-weight-bold">
                                    {{ item.title }}
                                </v-list-item-title>
                            </v-list-item>
                        </template>

                        <v-list-item v-for="sub in item.children" :key="sub.title" :to="sub.to" exact>
                            <template v-slot:prepend>
                                <v-icon color="AzulNeuro" size="24">{{ sub.icon || 'mdi-circle-small' }}</v-icon>
                            </template>
                            <v-list-item-title class="text-subtitle-2">
                                <b>{{ sub.title }}</b>
                            </v-list-item-title>
                        </v-list-item>
                    </v-list-group>
                </template>
            </v-list>
        </v-navigation-drawer>

        <!-- Barra superior -->
        <v-app-bar app>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-img src="/imagenes/icono-logo.png" contain max-height="50" max-width="50" class="ml-3"></v-img>
            <strong class="ml-5">
                Bienvenido a NeuroAR - {{ user?.name || "Usuario Desconocido" }}
            </strong>
        </v-app-bar>

        <!-- Contenido de las páginas -->
        <v-main>
            <slot />
        </v-main>
    </v-app>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useNuxtApp } from '#app';

const drawer = ref(true);
const authStore = useAuthStore();
const user = computed(() => authStore.user);
const menu = computed(() => useNuxtApp().$menu);
</script>