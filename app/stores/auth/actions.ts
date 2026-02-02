import type { AuthState } from './state'
import { COOKIE_OPTIONS } from './constants'

export const authActions = {
	syncFromCookies(this: AuthState) {
		const tokenCookie = useCookie<string | null>('cls_pm_token', COOKIE_OPTIONS)
		const userIdCookie = useCookie<string | null>('cls_pm_user_id', COOKIE_OPTIONS)
		const isGuestCookie = useCookie<boolean>('cls_pm_guest', COOKIE_OPTIONS)

		this.token = tokenCookie.value
		this.userId = userIdCookie.value
		this.isGuest = isGuestCookie.value ?? false
	},

	setToken(this: AuthState, token: string) {
		const tokenCookie = useCookie<string | null>('cls_pm_token', COOKIE_OPTIONS)
		const isGuestCookie = useCookie<boolean>('cls_pm_guest', COOKIE_OPTIONS)

		tokenCookie.value = token
		isGuestCookie.value = false

		this.token = token
		this.isGuest = false
	},

	setUserId(this: AuthState, userId: string) {
		const userIdCookie = useCookie<string | null>('cls_pm_user_id', COOKIE_OPTIONS)
		userIdCookie.value = userId
		this.userId = userId
	},

	setGuest(this: AuthState) {
		const tokenCookie = useCookie<string | null>('cls_pm_token', COOKIE_OPTIONS)
		const userIdCookie = useCookie<string | null>('cls_pm_user_id', COOKIE_OPTIONS)
		const isGuestCookie = useCookie<boolean>('cls_pm_guest', COOKIE_OPTIONS)

		tokenCookie.value = null
		userIdCookie.value = null
		isGuestCookie.value = true

		this.token = null
		this.userId = null
		this.isGuest = true
	},

	logout(this: AuthState) {
		const tokenCookie = useCookie<string | null>('cls_pm_token', COOKIE_OPTIONS)
		const userIdCookie = useCookie<string | null>('cls_pm_user_id', COOKIE_OPTIONS)
		const isGuestCookie = useCookie<boolean>('cls_pm_guest', COOKIE_OPTIONS)

		tokenCookie.value = null
		userIdCookie.value = null
		isGuestCookie.value = false

		this.token = null
		this.userId = null
		this.isGuest = false
	}
}
