<script>
import { useAuthStore } from '@/stores/auth'

export default {
    name: 'WorkspaceJsonResultados',
    data() {
        return {
            imageUrl: '',
            loading: true,
        }
    },
    async mounted() {
        await this.fetchImage()
    },
    methods: {
        async fetchImage() {
            this.loading = true
            try {
                const authStore = useAuthStore()
                const user = authStore.getUser

                if (!user || !user.id) {
                    throw new Error('Usuario no autenticado')
                }

                const pacienteRes = await this.$axios.get(`/paciente-id/${user.id}`)
                const pacienteId = pacienteRes.data.paciente_id

                const response = await this.$axios.post('/saludo', {
                    paciente_id: pacienteId,
                })

                const imageUrl = response.data.imagen

                const imageExists = await this.checkImageExists(imageUrl)

                this.imageUrl = imageExists ? imageUrl : ''

            } catch (error) {
                console.error('Error al obtener imagen:', error)
                this.imageUrl = ''
            } finally {
                this.loading = false
            }
        },

        async checkImageExists(url) {
            try {
                const response = await fetch(url, { method: 'HEAD' })
                return response.ok
            } catch (e) {
                return false
            }
        },
    },
}
</script>
