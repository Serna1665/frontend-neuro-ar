<template>
    <v-app>
        <v-navigation-drawer v-model="drawer" app permanent>
            <!-- Contenedor principal en columna que ocupe toda la altura -->
            <div class="d-flex flex-column fill-height">
                <!-- Sección superior scrollable para el menú -->
                <div class="overflow-y-auto">
                    <v-col cols="12" class="d-flex justify-center">
                        <v-img src="/imagenes/neuroar.png" contain max-height="150" max-width="250" />
                    </v-col>

                    <v-list>
                        <template v-for="item in menu" :key="item.title">
                            <v-list-group v-if="item.children && item.children.length" :value="openGroups[item.title]"
                                @click="toggleGroup(item.title)">
                                <template v-slot:activator="{ props }">
                                    <v-list-item v-bind="props">
                                        <template v-slot:prepend>
                                            <v-icon color="AzulNeuro" size="24">{{ item.icon }}</v-icon>
                                        </template>
                                        <v-list-item-title class="text-body-2 font-weight-bold">
                                            {{ item.title }}
                                        </v-list-item-title>
                                    </v-list-item>
                                </template>

                                <v-list-item v-for="sub in item.children" :key="sub.title" link :to="sub.to" exact
                                    :class="{ 'bg-blue-lighten-4': $route.path === sub.to }">
                                    <template v-slot:prepend>
                                        <v-icon color="AzulNeuro" size="20">{{ sub.icon || 'mdi-circle-small' }}
                                        </v-icon>
                                    </template>
                                    <v-list-item-title class="text-body-2">
                                        <b>{{ sub.title }}</b>
                                    </v-list-item-title>
                                </v-list-item>
                            </v-list-group>

                            <v-list-item v-else link :to="item.to" exact>
                                <v-row align="center">
                                    <v-col cols="3" class="d-flex justify-center">
                                        <v-icon color="AzulNeuro" size="24">{{ item.icon }}</v-icon>
                                    </v-col>
                                    <v-divider vertical class="mx-2"></v-divider>
                                    <v-col cols="8">
                                        <v-list-item-title class="text-body-2 font-weight-bold">
                                            {{ item.title }}
                                        </v-list-item-title>
                                    </v-col>
                                </v-row>
                            </v-list-item>
                        </template>
                    </v-list>
                </div>
                <!-- Sección fija en la parte inferior para "Cerrar Sesión" -->
                <div class="mt-auto">
                    <v-divider color="blue"></v-divider>
                    <v-list-item link :to="'/'" class="d-flex flex-column align-center">
                        <v-list-item-icon class="d-flex justify-center">
                            <v-icon color="red" size="24">mdi-power</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title class="text-body-2 font-weight-bold text-center">
                            Cerrar Sesión
                        </v-list-item-title>
                    </v-list-item>
                </div>
            </div>
        </v-navigation-drawer>

        <v-app-bar app>
            <v-app-bar-nav-icon @click="drawer = !drawer" />
            <v-spacer />
            <div class="d-flex align-center">
                <strong>Bienvenido a NeuroAR - {{ user?.name || "Usuario Desconocido" }}</strong>
            </div>
            <v-spacer />
            <v-menu offset-y>
                <template #activator="{ props, on }">
                    <v-btn v-bind="props" v-on="on" icon>
                        <v-icon size="28">mdi-account</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item to="" component="RouterLink">
                        <v-list-item-title>Mi Perfil</v-list-item-title>
                    </v-list-item>
                    <v-list-item to="/" component="RouterLink" @click="cerrarSesion">
                        <v-list-item-title>Cerrar Sesión</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-app-bar>


        <v-main>
            <NuxtPage />
        </v-main>
    </v-app>
</template>

<script>
import {
    useAuthStore
} from "@/stores/auth";
import {
    reactive
} from "vue";
import {
    useNuxtApp
} from "#app";

export default {
    data() {
        return {
            drawer: true,
            openGroups: reactive({}),
        };
    },
    computed: {
        user() {
            const authStore = useAuthStore();
            return authStore.user;
        },
        menu() {
            return useNuxtApp().$menu;
        },
    },
    methods: {
        toggleGroup(groupTitle) {
            this.openGroups[groupTitle] = !this.openGroups[groupTitle];
        },
    },
};
</script>

<style scoped>
.fill-height {
    height: 100%;
}
</style>