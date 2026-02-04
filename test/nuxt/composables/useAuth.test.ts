import { describe, expect, it, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

import { useAuth } from '@/composables/useAuth'

const { loginMock, registerMock } = vi.hoisted(() => {
	return {
		loginMock: vi.fn(async () => ({ bearer: 't', userId: 'u' })),
		registerMock: vi.fn(async () => ({}))
	}
})

mockNuxtImport('useClsPmApi', () => {
	return () => {
		return {
			login: loginMock,
			registerUser: registerMock
		}
	}
})

describe('useAuth', () => {
	it('exposes sessionType based on store state', () => {
		const auth = useAuth()

		expect(auth.sessionType.value).toBe('anonymous')

		auth.loginAsGuest()
		expect(auth.sessionType.value).toBe('guest')
	})
})
