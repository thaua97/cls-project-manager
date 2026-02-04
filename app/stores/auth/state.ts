export interface AuthState {
	token: string | null
	userId: string | null
	isGuest: boolean
}

export const initialState = (): AuthState => ({
	token: null,
	userId: '',
	isGuest: false
})
