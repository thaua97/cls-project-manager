import type {
	ProjectSort
} from '@/utils/clsPmApi/types'

import type { CreateProjectInput, UpdateProjectInput } from '#shared/types/project'
import { useAuthStore } from '@/stores/auth'
import { mapApiProjectToUi } from '@/utils/mapApiProjectToUi'

export const useProjectsApi = () => {
	const authStore = useAuthStore()
	const remote = useProjectsRemoteApi()
	const guestStorage = useGuestProjectsStorage()

	const isGuest = () => authStore.isGuest

	const listProjects = async (params?: {
		favorites?: boolean
		sort?: ProjectSort
		query?: string
	}) => {
		if (isGuest()) {
			try {
				const projects = guestStorage.list(params)
				return { success: true as const, total: projects.length, projects }
			} catch {
				return { success: false as const, error: 'Erro ao carregar projetos' }
			}
		}

		try {
			const data = await remote.listProjects(params)
			return {
				success: true as const,
				total: data.total,
				projects: data.projects.map(mapApiProjectToUi)
			}
		} catch {
			return { success: false as const, error: 'Erro ao carregar projetos' }
		}
	}

	const getProject = async (id: string) => {
		if (isGuest()) {
			try {
				const project = guestStorage.getById(id)
				return project
					? { success: true as const, project }
					: { success: false as const, error: 'Projeto não encontrado' }
			} catch {
				return { success: false as const, error: 'Erro ao carregar projeto' }
			}
		}

		try {
			const data = await remote.getProject(id)
			return { success: true as const, project: mapApiProjectToUi(data.project) }
		} catch {
			return { success: false as const, error: 'Erro ao carregar projeto' }
		}
	}

	const createProject = async (input: CreateProjectInput) => {
		if (isGuest()) {
			try {
				const project = guestStorage.create(input)
				return { success: true as const, project }
			} catch {
				return { success: false as const, error: 'Erro ao criar projeto' }
			}
		}

		try {
			const data = await remote.createProject(input)
			const projectResponse = await remote.getProject(data.id)
			return {
				success: true as const,
				project: mapApiProjectToUi(projectResponse.project)
			}
		} catch {
			return { success: false as const, error: 'Erro ao criar projeto' }
		}
	}

	const updateProject = async (id: string, input: Omit<UpdateProjectInput, 'id'>) => {
		if (isGuest()) {
			try {
				const updated = guestStorage.update(id, input)
				return updated
					? { success: true as const, project: updated }
					: { success: false as const, error: 'Projeto não encontrado' }
			} catch {
				return { success: false as const, error: 'Erro ao atualizar projeto' }
			}
		}

		try {
			const data = await remote.updateProject(id, input)
			return {
				success: true as const,
				project: mapApiProjectToUi(data.project)
			}
		} catch {
			return { success: false as const, error: 'Erro ao atualizar projeto' }
		}
	}

	const deleteProject = async (id: string) => {
		if (isGuest()) {
			try {
				guestStorage.remove(id)
				return { success: true as const }
			} catch {
				return { success: false as const, error: 'Erro ao remover projeto' }
			}
		}

		try {
			await remote.deleteProject(id)
			return { success: true as const }
		} catch {
			return { success: false as const, error: 'Erro ao remover projeto' }
		}
	}

	const toggleFavorite = async (id: string) => {
		if (isGuest()) {
			try {
				const updated = guestStorage.toggleFavorite(id)
				return updated
					? { success: true as const, project: updated }
					: { success: false as const, error: 'Projeto não encontrado' }
			} catch {
				return { success: false as const, error: 'Erro ao favoritar projeto' }
			}
		}

		try {
			const data = await remote.toggleFavoriteProject(id)
			return {
				success: true as const,
				project: mapApiProjectToUi(data.project)
			}
		} catch {
			return { success: false as const, error: 'Erro ao favoritar projeto' }
		}
	}

	const uploadBackground = async (id: string, file: File) => {
		if (isGuest()) {
			return { success: false as const, error: 'Upload não disponível para convidados' }
		}

		try {
			const data = await remote.uploadBackground(id, file)
			return {
				success: true as const,
				project: mapApiProjectToUi(data.project)
			}
		} catch {
			return { success: false as const, error: 'Erro ao fazer upload da imagem' }
		}
	}

	return {
		listProjects,
		getProject,
		createProject,
		updateProject,
		deleteProject,
		toggleFavorite,
		uploadBackground
	}
}
