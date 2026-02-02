import type { AuthState } from './state'

export const authGetters = {
	isAuthenticated(state: AuthState): boolean {
		return Boolean(state.token) || state.isGuest
	}
}
