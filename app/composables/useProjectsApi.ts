import type {
	ApiProject,
	ProjectSort
} from '../utils/clsPmApi/types'

import { ProjectStatus } from '#shared/types/project'
import { useAuthStore } from '../stores/auth'

const mapApiProjectToUi = (project: ApiProject) => {
	return {
		id: project.id,
		name: project.name,
		client: project.client,
		backgroundUrl: project.backgroundUrl ?? undefined,
		startDate: project.startDate,
		endDate: project.endDate,
		userId: project.userId,
		status: ProjectStatus.NOT_STARTED,
		isFavorite: project.isFavorite,
		createdAt: project.createdAt,
		updatedAt: project.updatedAt
	}
}

export const useProjectsApi = () => {
	const api = useClsPmApi()
	const authStore = useAuthStore()
	authStore.syncFromCookies()

	const isGuest = () => authStore.isGuest
	const guestStorageKey = 'cls_pm_guest_projects'

	type GuestProject = ReturnType<typeof mapApiProjectToUi>

	const readGuestProjects = (): GuestProject[] => {
		if (typeof window === 'undefined') {
			return []
		}
		try {
			const raw = localStorage.getItem(guestStorageKey)
			if (!raw) {
				return []
			}
			const parsed = JSON.parse(raw) as unknown
			return Array.isArray(parsed) ? (parsed as GuestProject[]) : []
		} catch {
			return []
		}
	}

	const writeGuestProjects = (projects: GuestProject[]) => {
		if (typeof window === 'undefined') {
			return
		}
		try {
			localStorage.setItem(guestStorageKey, JSON.stringify(projects))
		} catch {
			return
		}
	}

	const sortGuestProjects = (projects: GuestProject[], sort?: ProjectSort) => {
		const sorted = [...projects]
		switch (sort) {
		case 'name_asc':
			return sorted.sort((a, b) => a.name.localeCompare(b.name))
		case 'startDate_desc':
			return sorted.sort(
				(a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
			)
		case 'endDate_asc':
			return sorted.sort(
				(a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
			)
		default:
			return sorted
		}
	}

	const listProjects = async (params?: {
		favorites?: boolean
		sort?: ProjectSort
		query?: string
	}) => {
		if (isGuest()) {
			try {
				let projects = readGuestProjects()

				if (params?.favorites !== undefined) {
					projects = projects.filter((p) => p.isFavorite === params.favorites)
				}

				if (params?.query && params.query.length >= 3) {
					const q = params.query.toLowerCase()
					projects = projects.filter(
						(p) =>
							p.name.toLowerCase().includes(q) ||
							(p.client?.toLowerCase().includes(q) ?? false)
					)
				}

				projects = sortGuestProjects(projects, params?.sort)

				return {
					success: true as const,
					total: projects.length,
					projects
				}
			} catch {
				return { success: false as const, error: 'Erro ao carregar projetos' }
			}
		}

		try {
			const data = await api.listProjects(params)
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
				const projects = readGuestProjects()
				const project = projects.find((p) => p.id === id)
				if (!project) {
					return { success: false as const, error: 'Projeto não encontrado' }
				}
				return { success: true as const, project }
			} catch {
				return { success: false as const, error: 'Erro ao carregar projeto' }
			}
		}

		try {
			const data = await api.getProject(id)
			return { success: true as const, project: mapApiProjectToUi(data.project) }
		} catch {
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
		if (isGuest()) {
			try {
				const projects = readGuestProjects()
				const now = new Date().toISOString()
				const id =
					typeof window !== 'undefined' && typeof crypto?.randomUUID === 'function'
						? crypto.randomUUID()
						: `guest-${Math.random().toString(36).slice(2)}`

				const status = (input.status as ProjectStatus) ?? ProjectStatus.NOT_STARTED
				const project: GuestProject = {
					id,
					name: input.name,
					client: input.client,
					backgroundUrl: undefined,
					startDate: input.startDate,
					endDate: input.endDate,
					userId: authStore.userId ?? '',
					status,
					isFavorite: false,
					createdAt: now,
					updatedAt: now
				}

				projects.push(project)
				writeGuestProjects(projects)

				return { success: true as const, project }
			} catch {
				return { success: false as const, error: 'Erro ao criar projeto' }
			}
		}

		try {
			const payload = {
				name: input.name,
				client: input.client,
				startDate: input.startDate,
				endDate: input.endDate
			}
			const data = await api.createProject(payload)

			const projectResponse = await api.getProject(data.id)
			return {
				success: true as const,
				project: mapApiProjectToUi(projectResponse.project)
			}
		} catch {
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
		if (isGuest()) {
			try {
				const projects = readGuestProjects()
				const index = projects.findIndex((p) => p.id === id)
				if (index === -1) {
					return { success: false as const, error: 'Projeto não encontrado' }
				}
				const current = projects[index]
				if (!current) {
					return { success: false as const, error: 'Projeto não encontrado' }
				}
				const updated: GuestProject = {
					...current,
					...(input.name !== undefined ? { name: input.name } : {}),
					...(input.client !== undefined ? { client: input.client } : {}),
					...(input.startDate !== undefined ? { startDate: input.startDate } : {}),
					...(input.endDate !== undefined ? { endDate: input.endDate } : {}),
					...(input.isFavorite !== undefined
						? { isFavorite: input.isFavorite }
						: {}),
					updatedAt: new Date().toISOString()
				}
				projects[index] = updated
				writeGuestProjects(projects)
				return { success: true as const, project: updated }
			} catch {
				return { success: false as const, error: 'Erro ao atualizar projeto' }
			}
		}

		try {
			const payload = {
				...(input.name !== undefined ? { name: input.name } : {}),
				...(input.client !== undefined
					? { client: input.client }
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
		} catch {
			return { success: false as const, error: 'Erro ao atualizar projeto' }
		}
	}

	const deleteProject = async (id: string) => {
		if (isGuest()) {
			try {
				const projects = readGuestProjects()
				writeGuestProjects(projects.filter((p) => p.id !== id))
				return { success: true as const }
			} catch {
				return { success: false as const, error: 'Erro ao remover projeto' }
			}
		}

		try {
			await api.deleteProject(id)
			return { success: true as const }
		} catch {
			return { success: false as const, error: 'Erro ao remover projeto' }
		}
	}

	const toggleFavorite = async (id: string) => {
		if (isGuest()) {
			try {
				const projects = readGuestProjects()
				const index = projects.findIndex((p) => p.id === id)
				if (index === -1) {
					return { success: false as const, error: 'Projeto não encontrado' }
				}
				const current = projects[index]
				if (!current) {
					return { success: false as const, error: 'Projeto não encontrado' }
				}
				const updated: GuestProject = {
					...current,
					isFavorite: !current.isFavorite,
					updatedAt: new Date().toISOString()
				}
				projects[index] = updated
				writeGuestProjects(projects)
				return { success: true as const, project: updated }
			} catch {
				return { success: false as const, error: 'Erro ao favoritar projeto' }
			}
		}

		try {
			const data = await api.toggleFavoriteProject(id)
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
			const data = await api.uploadBackground(id, file)
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
