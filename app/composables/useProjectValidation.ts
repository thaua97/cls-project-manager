import type { CreateProjectInput } from '../../shared/types/project'

interface ValidationErrors {
	name?: string
	description?: string
	startDate?: string
	endDate?: string
	status?: string
}

export const useProjectValidation = () => {
	const validateProject = (
		input: Partial<CreateProjectInput>
	): ValidationErrors => {
		const errors: ValidationErrors = {}

		if (!input.name || input.name.trim().length === 0) {
			errors.name = 'Nome do projeto é obrigatório'
		} else if (input.name.trim().length < 3) {
			errors.name = 'Nome deve ter no mínimo 3 caracteres'
		} else if (input.name.trim().length > 100) {
			errors.name = 'Nome deve ter no máximo 100 caracteres'
		}

		if (!input.description || input.description.trim().length === 0) {
			errors.description = 'Descrição é obrigatória'
		} else if (input.description.trim().length < 10) {
			errors.description = 'Descrição deve ter no mínimo 10 caracteres'
		} else if (input.description.trim().length > 500) {
			errors.description = 'Descrição deve ter no máximo 500 caracteres'
		}

		if (!input.startDate) {
			errors.startDate = 'Data de início é obrigatória'
		}

		if (!input.endDate) {
			errors.endDate = 'Data de finalização é obrigatória'
		}

		if (input.startDate && input.endDate) {
			const start = new Date(input.startDate)
			const end = new Date(input.endDate)

			if (end < start) {
				errors.endDate = 'Data de finalização deve ser posterior à data de início'
			}
		}

		if (!input.status) {
			errors.status = 'Status é obrigatório'
		}

		return errors
	}

	const hasErrors = (errors: ValidationErrors): boolean => {
		return Object.keys(errors).length > 0
	}

	return {
		validateProject,
		hasErrors
	}
}
