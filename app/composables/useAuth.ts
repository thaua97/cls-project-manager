import type { LoginRequest, RegisterUserRequest } from '../utils/clsPmApi/types'
import { useAuthStore } from '../stores/auth'
import { useToast } from '#ui/composables/useToast'

export const useAuth = () => {
	const store = useAuthStore()
	const api = useClsPmApi()
	const toast = useToast()
	const canUseCredentials = useState<boolean>('auth:can-use-credentials', () => false)
	const isCheckingHealth = useState<boolean>('auth:is-checking-health', () => false)

	const isAuthenticated = computed(() => store.isAuthenticated)
	const isGuest = computed(() => store.isGuest)
	const token = computed(() => store.token)
	const userId = computed(() => store.userId)
	const sessionType = computed(() => {
		if (store.isGuest) {
			return 'guest' as const
		}
		if (store.token) {
			return 'user' as const
		}
		return 'anonymous' as const
	})

	const checkHealth = async () => {
		if (typeof window === 'undefined') {
			return
		}

		isCheckingHealth.value = true
		try {
			const response = await api.health()
			canUseCredentials.value = response?.status === 'ok'
		} catch {
			canUseCredentials.value = false
		} finally {
			isCheckingHealth.value = false
		}
	}

	const login = async (payload: LoginRequest) => {
		try {
			const response = await api.login(payload)
			store.setToken(response.bearer)
			store.setUserId(response.userId)
			toast.add({
				title: 'Login realizado com sucesso',
				description: 'Você foi autenticado com sucesso.',
				icon: 'i-lucide-check'
			})
			return { success: true as const }

		} catch (error: unknown) {
			toast.add({
				title: 'Erro ao realizar login',
				color: 'error',
				description: 'Verifique as credenciais e tente novamente.',
				icon: 'i-lucide-check'
			})
			const message =
				(error as { response?: { data?: { message?: string } } })?.response?.data
					?.message ?? 'Credenciais inválidas'
					
			return { success: false as const, error: message }
		}
	}

	const register = async (payload: RegisterUserRequest) => {
		try {
			await api.registerUser(payload)
			toast.add({
				title: 'Conta criada com sucesso',
				description: 'Basta realizar o login para começar.',
				icon: 'i-lucide-check'
			})
			return { success: true as const }
		} catch (error: unknown) {
			toast.add({
				title: 'Erro ao realizar login',
				color: 'error',
				description: 'Tente novamente.',
				icon: 'i-lucide-check'
			})
			const message =
				(error as { response?: { data?: { message?: string } } })?.response?.data
					?.message ?? 'Erro ao criar conta'
			return { success: false as const, error: message }
		}
	}

	const loginAsGuest = () => {
		store.setGuest()
	}

	const logout = () => {
		store.logout()
	}

	return {
		isAuthenticated,
		isGuest,
		sessionType,
		token,
		userId,
		canUseCredentials,
		isCheckingHealth,
		checkHealth,
		login,
		register,
		loginAsGuest,
		logout
	}
}
