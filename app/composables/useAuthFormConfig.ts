import * as z from 'zod'
import type { AuthFormField } from '@nuxt/ui'

import type { AuthModalMode } from './useAuthModal'

export const useAuthFormConfig = (mode: Ref<AuthModalMode>) => {
	const title = computed(() => (mode.value === 'login' ? 'Login' : 'Criar conta'))
	const description = computed(() =>
		mode.value === 'login'
			? 'Entre com suas credenciais para acessar sua conta.'
			: 'Preencha os dados para criar sua conta.'
	)

	const schema = computed(() => {
		if (mode.value === 'login') {
			return z.object({
				email: z.string().email('Email inválido'),
				password: z.string().min(1, 'Senha é obrigatória')
			})
		}

		return z.object({
			name: z.string().min(1, 'Nome é obrigatório'),
			email: z.string().email('Email inválido'),
			password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres')
		})
	})

	const fields = computed<AuthFormField[]>(() => {
		if (mode.value === 'login') {
			return [
				{
					name: 'email',
					type: 'email',
					label: 'Email',
					placeholder: 'Seu email',
					required: true
				},
				{
					name: 'password',
					type: 'password',
					label: 'Senha',
					placeholder: 'Sua senha',
					required: true
				}
			]
		}

		return [
			{
				name: 'name',
				type: 'text',
				label: 'Nome',
				placeholder: 'Seu nome',
				required: true
			},
			{
				name: 'email',
				type: 'email',
				label: 'Email',
				placeholder: 'Seu email',
				required: true
			},
			{
				name: 'password',
				type: 'password',
				label: 'Senha',
				placeholder: 'Crie uma senha',
				required: true
			}
		]
	})

	const submitLabel = computed(() =>
		mode.value === 'login' ? 'Entrar' : 'Criar conta'
	)

	return {
		title,
		description,
		schema,
		fields,
		submitLabel
	}
}
