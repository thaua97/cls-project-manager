import { describe, expect, it } from 'vitest'

import { useProjectValidation } from '@/composables/useProjectValidation'

describe('useProjectValidation', () => {
	it('returns errors for missing fields', () => {
		const { validateProject, hasErrors } = useProjectValidation()

		const errors = validateProject({})

		expect(hasErrors(errors)).toBe(true)
		expect(errors.name).toBe('Nome do projeto é obrigatório')
		expect(errors.client).toBe('Cliente é obrigatório')
		expect(errors.startDate).toBe('Data de início é obrigatória')
		expect(errors.endDate).toBe('Data de finalização é obrigatória')
	})

	it('validates min/max lengths', () => {
		const { validateProject } = useProjectValidation()

		const errors = validateProject({
			name: 'ab',
			client: 'a',
			startDate: '2025-01-01',
			endDate: '2025-01-02'
		})

		expect(errors.name).toBe('Nome deve ter no mínimo 3 caracteres')
		expect(errors.client).toBe('Cliente deve ter no mínimo 2 caracteres')
	})

	it('endDate must be >= startDate', () => {
		const { validateProject } = useProjectValidation()

		const errors = validateProject({
			name: 'Valid name',
			client: 'Valid',
			startDate: '2025-01-10',
			endDate: '2025-01-09'
		})

		expect(errors.endDate).toBe(
			'Data de finalização deve ser posterior à data de início'
		)
	})

	it('returns empty errors for valid input', () => {
		const { validateProject, hasErrors } = useProjectValidation()

		const errors = validateProject({
			name: 'Project',
			client: 'Client',
			startDate: '2025-01-01',
			endDate: '2025-01-02'
		})

		expect(hasErrors(errors)).toBe(false)
		expect(errors).toEqual({})
	})
})
