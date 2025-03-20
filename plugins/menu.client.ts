import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
    const menu_items = [
        {
            title: 'Resultados',
            icon: 'mdi-file-chart',
            permission: 'remo',
            children: [
                {
                    title: 'Test 1',
                    icon: 'mdi-clipboard-text',
                    permission: 'remo',
                    to: '/resultados'
                }
            ]
        },
        {
            title: 'Reportes',
            icon: 'mdi-chart-bar',
            permission: '', 
            children: [
                {
                    title: 'Usuarios',
                    icon: 'mdi-account-group',
                    permission: '',
                    to: '/usuarios'
                },
                {
                    title: 'Resultados',
                    icon: 'mdi-shield-account',
                    permission: '',
                    to: '/resultados'
                }
            ]
        },
        {
            title: 'Configuración',
            icon: 'mdi-cog',
            permission: 'view_settings',
            children: [
                {
                    title: 'Usuarios',
                    icon: 'mdi-account-group',
                    permission: 'manage_users',
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
                    icon: 'mdi-shield-account',
                    permission: '',
                    to: '/roles'
                },
                {
                    title: 'Empresas',
                    icon: 'mdi-shield-account',
                    permission: '',
                    to: '/roles'
                },
                {
                    title: 'Oficios',
                    icon: 'mdi-shield-account',
                    permission: '',
                    to: '/roles'
                },
                {
                    title: 'Pacientes',
                    icon: 'mdi-shield-account',
                    permission: '',
                    to: '/roles'
                }
            ]
        }
    ]

    let user_permissions: string[] = []
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

    // Filtrar menú según permisos del usuario
    const filtered_menu = menu_items
        .map(item => {
            const has_permission = !item.permission || user_permissions.includes(item.permission)
            const filtered_children = item.children ? item.children.filter(sub =>
                !sub.permission || user_permissions.includes(sub.permission)
            ) : []

            return has_permission || filtered_children.length > 0 ? { ...item, children: filtered_children } : null
        })
        .filter(item => item !== null)

    nuxtApp.provide('menu', filtered_menu)
})
