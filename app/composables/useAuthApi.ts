export const useAuthApi = () => {
	const api = useClsPmApi()
	const tokenCookie = useCookie<string | null>('cls_pm_token', {
		sameSite: 'lax'
	})

	const token = computed(() => tokenCookie.value)

	const login = async (input: { email: string; password: string }) => {
		try {
			const { token } = await api.login(input)
			tokenCookie.value = token
			return { success: true as const, token }
		} catch (error) {
			console.error('Error logging in:', error)
			return { success: false as const, error: 'Erro ao autenticar' }
		}
	}

	const register = async (input: {
		name: string
		email: string
		password: string
	}) => {
		try {
			const data = await api.registerUser(input)
			return { success: true as const, userId: data.id }
		} catch (error) {
			console.error('Error registering user:', error)
			return { success: false as const, error: 'Erro ao criar usuário' }
		}
	}

	const logout = async () => {
		try {
			tokenCookie.value = null
			return { success: true as const }
		} catch (error) {
			console.error('Error logging out:', error)
			return { success: false as const, error: 'Erro ao sair' }
		}
	}

	return {
		token,
		login,
		register,
		logout
	}
}
