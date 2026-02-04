import { describe, expect, it } from 'vitest'
import { ref } from 'vue'

import { useAuthFormConfig } from '@/composables/useAuthFormConfig'

describe('useAuthFormConfig', () => {
	it('login schema validates required fields and preprocesses undefined to empty string', () => {
		const mode = ref<'login' | 'register'>('login')
		const cfg = useAuthFormConfig(mode)

		const schema = cfg.schema.value
		const parsed = schema.safeParse({ email: undefined, password: undefined })

		expect(parsed.success).toBe(false)
		if (parsed.success) {return}

		const messages = parsed.error.issues.map((i) => i.message)
		expect(messages).toContain('Email é obrigatório')
		expect(messages).toContain('Senha é obrigatória')
	})

	it('register schema requires name and password min length', () => {
		const mode = ref<'login' | 'register'>('register')
		const cfg = useAuthFormConfig(mode)

		const schema = cfg.schema.value
		const parsed = schema.safeParse({
			name: '',
			email: 'bad',
			password: '123'
		})

		expect(parsed.success).toBe(false)
		if (parsed.success) {return}

		const messages = parsed.error.issues.map((i) => i.message)
		expect(messages).toContain('Nome é obrigatório')
		expect(messages).toContain('Email inválido')
		expect(messages).toContain('Senha deve ter no mínimo 6 caracteres')
	})

	it('computed labels change with mode', () => {
		const mode = ref<'login' | 'register'>('login')
		const cfg = useAuthFormConfig(mode)

		expect(cfg.title.value).toBe('Login')
		expect(cfg.submitLabel.value).toBe('Entrar')

		mode.value = 'register'

		expect(cfg.title.value).toBe('Criar conta')
		expect(cfg.submitLabel.value).toBe('Criar conta')
	})
})
