import type { LoginRequest, RegisterUserRequest } from '../utils/clsPmApi/types'
import { useAuthStore } from '../stores/auth'

export const useAuth = () => {
	const store = useAuthStore()
	const api = useClsPmApi()

	const isAuthenticated = computed(() => store.isAuthenticated)
	const isGuest = computed(() => store.isGuest)
	const token = computed(() => store.token)
	const userId = computed(() => store.userId)

	const login = async (payload: LoginRequest) => {
		try {
			const response = await api.login(payload)
			console.warn('[AUTH] Token received, length:', response.bearer?.length)
			store.setToken(response.bearer)
			store.setUserId(response.userId)
			console.warn('[AUTH] isAuthenticated after setToken:', store.isAuthenticated)
			return { success: true as const }

		} catch (error: unknown) {
			console.error('Login error:', error)
			const message =
				(error as { response?: { data?: { message?: string } } })?.response?.data
					?.message ?? 'Credenciais inválidas'
			return { success: false as const, error: message }
		}
	}

	const register = async (payload: RegisterUserRequest) => {
		try {
			await api.registerUser(payload)
			return { success: true as const }
		} catch (error: unknown) {
			console.error('Register error:', error)
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
		token,
		userId,
		login,
		register,
		loginAsGuest,
		logout
	}
}
