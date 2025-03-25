import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
    const menu_items = [
        {
            title: 'Inicio',
            icon: 'mdi-home',
            permission: '',
            children: [
                {
                    title: 'Inicio',
                    icon: 'mdi-home-circle',
                    permission: '',
                    to: '/inicio'
                },
                {
                    title: 'Gestor de contenido',
                    icon: 'mdi-file-document-edit',
                    permission: '',
                    to: ''
                },
            ]
        },
        {
            title: 'Reportes',
            icon: 'mdi-chart-bar',
            permission: '',
            children: [
                {
                    title: 'Resultados',
                    icon: 'mdi-chart-areaspline',
                    permission: '',
                    to: '/resultados'
                }
            ]
        },
        {
            title: 'Configuración',
            icon: 'mdi-cog',
            permission: '',
            children: [
                {
                    title: 'Pacientes',
                    icon: 'mdi-account-multiple',
                    permission: '',
                    to: '/pacientes'
                },
                {
                    title: 'Empresas',
                    icon: 'mdi-office-building',
                    permission: '',
                    to: '/empresas'
                },
                {
                    title: 'Oficios',
                    icon: 'mdi-briefcase-variant',
                    permission: '',
                    to: '/oficios'
                },
            ]
        },
        {
            title: 'Admin',
            icon: 'mdi-account-tie',
            permission: '',
            children: [
                {
                    title: 'Usuarios',
                    icon: 'mdi-account-group',
                    permission: '',
                    to: '/usuarios'
                },
                {
                    title: 'Roles',
                    icon: 'mdi-shield-account',
                    permission: '',
                    to: '/roles'
                },
                {
                    title: 'Permisos',
                    icon: 'mdi-lock-open-outline',
                    permission: '',
                    to: '/permisos'
                },
            ]
        },
    ]

    let user_permissions = []
    if (process.client) {
        const user = localStorage.getItem('user')
        if (user) {
            try {
                const parsedUser = JSON.parse(user)
                user_permissions = parsedUser.permissions || []
            } catch (error) {
                console.error("Error al leer permisos del usuario:", error)
            }
        }
    }

    const filtered_menu = menu_items
        .map(item => {
            const has_permission = !item.permission || user_permissions.includes(item.permission)
            const filtered_children = item.children
                ? item.children.filter(sub => !sub.permission || user_permissions.includes(sub.permission))
                : []

            return has_permission || filtered_children.length > 0
                ? { ...item, children: filtered_children }
                : null
        })
        .filter(item => item !== null)

    nuxtApp.provide('menu', filtered_menu)
})