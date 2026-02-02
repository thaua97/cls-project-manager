export interface ApiErrorPayload {
	code?: string
	message?: string
	details?: unknown
}

export interface RegisterUserRequest {
	name: string
	email: string
	password: string
}

export interface RegisterUserResponse {
	id: string
}

export interface LoginRequest {
	email: string
	password: string
}

export interface LoginResponse {
	userId: string
	bearer: string
}

export type ProjectSort = 'name_asc' | 'startDate_desc' | 'endDate_asc'

export interface ApiProject {
	id: string
	name: string
	client: string | null
	startDate: string
	endDate: string
	isFavorite: boolean
	createdAt: string
	updatedAt: string
}

export interface ListProjectsResponse {
	total: number
	projects: ApiProject[]
}

export interface GetProjectResponse {
	project: ApiProject
}

export interface CreateProjectRequest {
	name: string
	client?: string | null
	startDate: string
	endDate: string
}

export interface CreateProjectResponse {
	id: string
}

export interface UpdateProjectRequest {
	name?: string
	client?: string | null
	startDate?: string
	endDate?: string
	isFavorite?: boolean
}

export interface UpdateProjectResponse {
	project: ApiProject
}

export interface ToggleFavoriteResponse {
	project: ApiProject
}
