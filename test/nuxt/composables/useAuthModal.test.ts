import { describe, expect, it } from 'vitest'

import { useAuthStore } from '@/stores/auth'
import { useAuthModal } from '@/composables/useAuthModal'

describe('useAuthModal', () => {
	it('isOpen is true when not authenticated and false when authenticated', () => {
		const store = useAuthStore()
		const modal = useAuthModal()

		expect(modal.isOpen.value).toBe(true)

		store.setGuest()

		expect(modal.isOpen.value).toBe(false)
	})

	it('openLogin and openRegister update mode', () => {
		const modal = useAuthModal()

		modal.openRegister()
		expect(modal.mode.value).toBe('register')

		modal.openLogin()
		expect(modal.mode.value).toBe('login')
	})

	it('toggleMode switches between login/register', () => {
		const modal = useAuthModal()

		expect(modal.mode.value).toBe('login')

		modal.toggleMode()
		expect(modal.mode.value).toBe('register')

		modal.toggleMode()
		expect(modal.mode.value).toBe('login')
	})
})
