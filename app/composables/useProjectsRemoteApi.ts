import type {
	CreateProjectRequest,
	ProjectSort,
	UpdateProjectRequest
} from '@/utils/clsPmApi/types'

export const useProjectsRemoteApi = () => {
	const api = useClsPmApi()

	return {
		listProjects: (params?: {
			favorites?: boolean
			sort?: ProjectSort
			query?: string
		}) => api.listProjects(params),
		getProject: (id: string) => api.getProject(id),
		createProject: (payload: {
			name: string
			client: string
			startDate: string
			endDate: string
		}) => {
			const dto: CreateProjectRequest = {
				name: payload.name,
				client: payload.client,
				startDate: payload.startDate,
				endDate: payload.endDate
			}
			return api.createProject(dto)
		},
		updateProject: (id: string, payload: {
			name?: string
			client?: string
			backgroundUrl?: string
			startDate?: string
			endDate?: string
			isFavorite?: boolean
		}) => {
			const dto: UpdateProjectRequest = {
				...(payload.name !== undefined ? { name: payload.name } : {}),
				...(payload.client !== undefined ? { client: payload.client } : {}),
				...(payload.backgroundUrl === '' ? { backgroundUrl: '' } : {}),
				...(payload.startDate !== undefined
					? { startDate: payload.startDate }
					: {}),
				...(payload.endDate !== undefined ? { endDate: payload.endDate } : {}),
				...(payload.isFavorite !== undefined
					? { isFavorite: payload.isFavorite }
					: {})
			}
			return api.updateProject(id, dto)
		},
		deleteProject: (id: string) => api.deleteProject(id),
		toggleFavoriteProject: (id: string) => api.toggleFavoriteProject(id),
		uploadBackground: (id: string, file: File) => api.uploadBackground(id, file)
	}
}
