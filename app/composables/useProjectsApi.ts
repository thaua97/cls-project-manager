import type {
	ApiProject,
	ProjectSort
} from '../utils/clsPmApi/types'

import { ProjectStatus } from '#shared/types/project'

const mapApiProjectToUi = (project: ApiProject) => {
	return {
		id: project.id,
		name: project.name,
		client: project.description ?? '',
		startDate: project.startDate,
		endDate: project.endDate,
		status: ProjectStatus.NOT_STARTED,
		isFavorite: project.isFavorite,
		createdAt: project.createdAt,
		updatedAt: project.updatedAt
	}
}

export const useProjectsApi = () => {
	const api = useClsPmApi()

	const listProjects = async (params?: {
		favorites?: boolean
		sort?: ProjectSort
		query?: string
	}) => {
		try {
			const data = await api.listProjects(params)
			return {
				success: true as const,
				total: data.total,
				projects: data.projects.map(mapApiProjectToUi)
			}
		} catch (error) {
			console.error('Error listing projects:', error)
			return { success: false as const, error: 'Erro ao carregar projetos' }
		}
	}

	const getProject = async (id: string) => {
		try {
			const data = await api.getProject(id)
			return { success: true as const, project: mapApiProjectToUi(data.project) }
		} catch (error) {
			console.error('Error getting project:', error)
			return { success: false as const, error: 'Erro ao carregar projeto' }
		}
	}

	const createProject = async (input: {
		name: string
		client: string
		startDate: string
		endDate: string
		background?: string
		status?: string
	}) => {
		try {
			const payload = {
				name: input.name,
				description: input.client,
				startDate: input.startDate,
				endDate: input.endDate
			}
			const data = await api.createProject(payload)
			const projectResponse = await api.getProject(data.id)
			return {
				success: true as const,
				project: mapApiProjectToUi(projectResponse.project)
			}
		} catch (error) {
			console.error('Error creating project:', error)
			return { success: false as const, error: 'Erro ao criar projeto' }
		}
	}

	const updateProject = async (id: string, input: {
		name?: string
		client?: string
		startDate?: string
		endDate?: string
		isFavorite?: boolean
	}) => {
		try {
			const payload = {
				...(input.name !== undefined ? { name: input.name } : {}),
				...(input.client !== undefined
					? { description: input.client }
					: {}),
				...(input.startDate !== undefined ? { startDate: input.startDate } : {}),
				...(input.endDate !== undefined ? { endDate: input.endDate } : {}),
				...(input.isFavorite !== undefined
					? { isFavorite: input.isFavorite }
					: {})
			}
			const data = await api.updateProject(id, payload)
			return {
				success: true as const,
				project: mapApiProjectToUi(data.project)
			}
		} catch (error) {
			console.error('Error updating project:', error)
			return { success: false as const, error: 'Erro ao atualizar projeto' }
		}
	}

	const deleteProject = async (id: string) => {
		try {
			await api.deleteProject(id)
			return { success: true as const }
		} catch (error) {
			console.error('Error deleting project:', error)
			return { success: false as const, error: 'Erro ao remover projeto' }
		}
	}

	const toggleFavorite = async (id: string) => {
		try {
			const data = await api.toggleFavoriteProject(id)
			return {
				success: true as const,
				project: mapApiProjectToUi(data.project)
			}
		} catch (error) {
			console.error('Error toggling favorite:', error)
			return { success: false as const, error: 'Erro ao favoritar projeto' }
		}
	}

	return {
		listProjects,
		getProject,
		createProject,
		updateProject,
		deleteProject,
		toggleFavorite
	}
}
