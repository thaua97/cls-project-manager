import { defineStore } from 'pinia'
import { initialState } from './state'
import { authGetters } from './getters'
import { authActions } from './actions'
export { COOKIE_OPTIONS } from './constants'

export const useAuthStore = defineStore('auth', {
	state: initialState,
	getters: authGetters,
	actions: authActions
})
