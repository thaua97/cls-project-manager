import { useAuthStore } from '~/stores/auth'

export type AuthModalMode = 'login' | 'register'

export const useAuthModal = () => {
	const authStore = useAuthStore()

	const isOpen = computed(() => !authStore.isAuthenticated)
	const mode = useState<AuthModalMode>('auth-modal:mode', () => 'login')

	const open = (nextMode: AuthModalMode = 'login') => {
		mode.value = nextMode
	}

	const openLogin = () => open('login')
	const openRegister = () => open('register')

	const close = () => {
		// Modal só fecha quando autenticado (controlado pelo computed isOpen)
	}

	const toggleMode = () => {
		mode.value = mode.value === 'login' ? 'register' : 'login'
	}

	return {
		isOpen,
		mode,
		open,
		openLogin,
		openRegister,
		close,
		toggleMode
	}
}
