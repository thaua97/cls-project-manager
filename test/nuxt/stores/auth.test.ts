import { describe, expect, it } from 'vitest'

import { useAuthStore } from '@/stores/auth'

type CookieRef<T> = { value: T }

type GlobalWithUseCookie = typeof globalThis & {
	useCookie?: <T>(name: string, opts?: unknown) => CookieRef<T>
}

const useCookie = (globalThis as GlobalWithUseCookie).useCookie as
	| (<T>(name: string, opts?: unknown) => CookieRef<T>)
	| undefined

const cookie = <T>(name: string): CookieRef<T> => {
	if (!useCookie) {
		throw new Error('useCookie mock not initialized. Check test/nuxt/setup.ts')
	}
	return useCookie<T>(name)
}

describe('auth store', () => {
	it('setGuest marks session as guest and clears token/userId', () => {
		const store = useAuthStore()

		store.setGuest()

		expect(store.isGuest).toBe(true)
		expect(store.token).toBeNull()
		expect(store.userId).toBeNull()
		expect(store.isAuthenticated).toBe(true)

		expect(cookie<string | null>('cls_pm_token').value).toBeNull()
		expect(cookie<string | null>('cls_pm_user_id').value).toBeNull()
		expect(cookie<boolean>('cls_pm_guest').value).toBe(true)
	})

	it('setToken sets token and disables guest', () => {
		const store = useAuthStore()

		store.setGuest()
		store.setToken('token-123')

		expect(store.isGuest).toBe(false)
		expect(store.token).toBe('token-123')
		expect(store.isAuthenticated).toBe(true)

		expect(cookie<string | null>('cls_pm_token').value).toBe('token-123')
		expect(cookie<boolean>('cls_pm_guest').value).toBe(false)
	})

	it('syncFromCookies hydrates state', () => {
		cookie<string | null>('cls_pm_token').value = 't'
		cookie<string | null>('cls_pm_user_id').value = 'u'
		cookie<boolean>('cls_pm_guest').value = false

		const store = useAuthStore()
		store.syncFromCookies()

		expect(store.token).toBe('t')
		expect(store.userId).toBe('u')
		expect(store.isGuest).toBe(false)
		expect(store.isAuthenticated).toBe(true)
	})
})
