import { z } from 'zod'

import { ProjectStatus, type CreateProjectInput } from '#shared/types/project'

export type ValidationErrors = Partial<Record<keyof CreateProjectInput, string>>

export const useProjectValidation = () => {
	const projectSchema = z
		.object({
			name: z
				.string()
				.optional()
				.refine((v) => !!v && v.trim().length > 0, {
					message: 'Nome do projeto é obrigatório'
				})
				.refine((v) => !!v && v.trim().length >= 3, {
					message: 'Nome deve ter no mínimo 3 caracteres'
				})
				.refine((v) => !!v && v.trim().length <= 100, {
					message: 'Nome deve ter no máximo 100 caracteres'
				}),
			client: z
				.string()
				.optional()
				.refine((v) => !!v && v.trim().length > 0, {
					message: 'Cliente é obrigatório'
				})
				.refine((v) => !!v && v.trim().length >= 2, {
					message: 'Cliente deve ter no mínimo 2 caracteres'
				})
				.refine((v) => !!v && v.trim().length <= 100, {
					message: 'Cliente deve ter no máximo 100 caracteres'
				}),
			startDate: z
				.string()
				.optional()
				.refine((v) => !!v && v.length > 0, {
					message: 'Data de início é obrigatória'
				}),
			endDate: z
				.string()
				.optional()
				.refine((v) => !!v && v.length > 0, {
					message: 'Data de finalização é obrigatória'
				}),
			status: z
				.nativeEnum(ProjectStatus)
				.optional()
				.refine((v) => !!v, { message: 'Status é obrigatório' })
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
