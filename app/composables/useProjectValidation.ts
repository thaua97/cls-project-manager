import { z } from 'zod'

import type { CreateProjectInput } from '#shared/types/project'

export type ValidationErrors = Partial<Record<keyof CreateProjectInput, string>>

export const useProjectValidation = () => {
	const asString = <T>(value: T) => (typeof value === 'string' ? value : '')

	const projectSchema = z
		.object({
			name: z.preprocess(
				asString,
				z
					.string()
					.min(1, 'Nome do projeto é obrigatório')
					.min(3, 'Nome deve ter no mínimo 3 caracteres')
					.max(100, 'Nome deve ter no máximo 100 caracteres')
			),
			client: z.preprocess(
				asString,
				z
					.string()
					.min(1, 'Cliente é obrigatório')
					.min(2, 'Cliente deve ter no mínimo 2 caracteres')
					.max(100, 'Cliente deve ter no máximo 100 caracteres')
			),
			startDate: z.preprocess(
				asString,
				z.string().min(1, 'Data de início é obrigatória')
			),
			endDate: z.preprocess(
				asString,
				z.string().min(1, 'Data de finalização é obrigatória')
			)
		})
		.superRefine((data, ctx) => {
			if (!data.startDate || !data.endDate) {return}

			const start = new Date(data.startDate)
			const end = new Date(data.endDate)

			if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
				if (end < start) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						path: ['endDate'],
						message:
							'Data de finalização deve ser posterior à data de início'
					})
				}
			}
		})

	const validateProject = (
		input: Partial<CreateProjectInput>
	): ValidationErrors => {
		const parsed = projectSchema.safeParse(input)
		if (parsed.success) {return {}}

		const errors: ValidationErrors = {}
		for (const issue of parsed.error.issues) {
			const field = issue.path[0]
			if (!field) {continue}
			if (typeof field !== 'string') {continue}
			if (field in errors) {continue
			}(errors as Record<string, string>)[field] = issue.message
		}
		return errors
	}

	const hasErrors = (errors: ValidationErrors): boolean =>
		Object.keys(errors).length > 0

	return {
		validateProject,
		hasErrors
	}
}
