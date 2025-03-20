<template>
    <v-app>
        <v-navigation-drawer v-model="drawer" app>
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

                        <v-list-item v-for="sub in item.children" :key="sub.title" link :to="sub.to" exact
                            :class="{ 'bg-blue-lighten-4': $route.path === sub.to }">
                            <template v-slot:prepend>
                                <v-icon color="AzulNeuro" size="24">{{ sub.icon || 'mdi-circle-small' }}</v-icon>
                            </template>
                            <v-list-item-title class="text-subtitle-2">
                                <b>{{ sub.title }}</b>
                            </v-list-item-title>
                        </v-list-item>
                    </v-list-group>

                    <v-list-item v-else link :to="item.to" exact>
                        <v-row align="center">
                            <v-col cols="3" class="d-flex justify-center">
                                <v-icon color="AzulNeuro" size="28">{{ item.icon }}</v-icon>
                            </v-col>
                            <v-divider vertical class="mx-2"></v-divider>
                            <v-col cols="8">
                                <v-list-item-title class="text-subtitle-1 font-weight-bold">
                                    {{ item.title }}
                                </v-list-item-title>
                            </v-col>
                        </v-row>
                    </v-list-item>
                </template>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar app>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

            <v-img src="/imagenes/icono-logo.png" contain max-height="50" max-width="50" class="ml-3"></v-img>

            <strong class="ml-5">
                Bienvenido a NeuroAR - {{ user?.name || "Usuario Desconocido" }}
            </strong>
        </v-app-bar>

        <v-main>
            <router-view></router-view>
        </v-main>
    </v-app>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
import { useNuxtApp } from '#app'

export default {
    data() {
        return {
            drawer: true,
            activeItem: null
        };
    },
    computed: {
        user() {
            const authStore = useAuthStore()
            return authStore.user
        },
        menu() {
            return useNuxtApp().$menu // Obtenemos el menú filtrado
        }
    },
    methods: {
        isActive(item) {
            return item.children?.some(sub => sub.to === this.activeItem);
        }
    },
    watch: {
        '$route.path'(newPath) {
            this.activeItem = newPath;
        }
    },
};
</script>
