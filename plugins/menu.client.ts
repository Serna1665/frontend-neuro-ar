import { defineNuxtPlugin } from '#app'
import { useAuthStore } from '@/stores/auth'
import { useState, watchEffect } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
    const authStore = useAuthStore();
    const menuState = useState<Array<{ title: string; icon: string; permission: string; children: Array<{ title: string; icon: string; permission: string; to: string }> }>>('menu', () => []);

    const generateMenu = () => {
        const menu_items = [
            {
                title: 'Inicio',
                icon: 'mdi-home',
                permission: '',
                children: [
                    { title: 'Dashboard', icon: 'mdi-view-dashboard', permission: '', to: '/inicio' },
                ]
            },
            {
                title: 'Resultados',
                icon: 'mdi-chart-bar',
                permission: 'reportes.vista',
                children: [
                    { title: 'Individuales', icon: 'mdi-human-greeting', permission: 'resultados.vista', to: '/resultados' },
                    { title: 'Empresa', icon: 'mdi-domain', permission: 'resultados.vista', to: '/resultadosEmpresa' }
                ]
            },
            {
                title: 'Configuración',
                icon: 'mdi-cog',
                permission: '',
                children: [
                    { title: 'Sedes', icon: 'mdi-home-group', permission: 'sedes.vista', to: '/sedes' },
                    { title: 'Empresas', icon: 'mdi-office-building', permission: '', to: '/empresas' },
                    { title: 'Oficios', icon: 'mdi-briefcase-variant', permission: 'oficios.menu', to: '/oficios' },
                    { title: 'Dependencias', icon: 'mdi-professional-hexagon', permission: 'dependencias.menu', to: '/dependencias' },
                ]
            },
            {
                title: 'Admin',
                icon: 'mdi-account-tie',
                permission: 'admin.menu',  
                children: [
                    { title: 'Usuarios', icon: 'mdi-account-group', permission: 'admin.usuarios', to: '/usuarios' },
                    { title: 'Roles', icon: 'mdi-shield-account', permission: 'admin.roles', to: '/roles' },
                    { title: 'Permisos', icon: 'mdi-lock-open-outline', permission: '', to: '/permisos' },
                ]
            },
        ];

        const user_permissions = authStore.permissions || [];

        return menu_items
            .map(item => {
                // Verificar si el usuario tiene permiso para ver el módulo padre
                if (item.permission && !user_permissions.includes(item.permission)) {
                    return null; // Si no tiene el permiso del padre, el módulo y sus hijos no se mostrarán
                }

                // Si tiene permiso del padre, filtrar los hijos por sus permisos
                const filtered_children = item.children
                    ? item.children.filter(sub => !sub.permission || user_permissions.includes(sub.permission))
                    : [];

                return { ...item, children: filtered_children };
            })
            .filter(item => item !== null);
    };

    watchEffect(() => {
        menuState.value = generateMenu();
    });

    nuxtApp.provide('menu', menuState);
});
