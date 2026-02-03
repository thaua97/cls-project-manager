import type { AxiosInstance } from 'axios'
import type { 
	UpdateProjectResponse,
	CreateProjectRequest,
	CreateProjectResponse,
	GetProjectResponse,
	ListProjectsResponse,
	LoginRequest,
	LoginResponse,
	ProjectSort,
	RegisterUserRequest,
	RegisterUserResponse,
	ToggleFavoriteResponse,
	UpdateProjectRequest,
	UploadBackgroundResponse } from './types'


export interface ClsPmApi {
	health(): Promise<{ status: string }>
	registerUser(payload: RegisterUserRequest): Promise<RegisterUserResponse>
	login(payload: LoginRequest): Promise<LoginResponse>
	listProjects(params?: {
		favorites?: boolean
		sort?: ProjectSort
		query?: string
	}): Promise<ListProjectsResponse>
	getProject(id: string): Promise<GetProjectResponse>
	createProject(payload: CreateProjectRequest): Promise<CreateProjectResponse>
	updateProject(
		id: string,
		payload: UpdateProjectRequest
	): Promise<UpdateProjectResponse>
	deleteProject(id: string): Promise<void>
	toggleFavoriteProject(id: string): Promise<ToggleFavoriteResponse>
	uploadBackground(id: string, file: File): Promise<UploadBackgroundResponse>
}

export const createClsPmApi = (client: AxiosInstance): ClsPmApi => {
	return {
		async health() {
			const { data } = await client.get('/health')
			return data
		},

		async registerUser(payload) {
			const { data } = await client.post('/users', payload)
			return data
		},

		async login(payload) {
			const { data } = await client.post('/auth/login', payload)
			return data
		},

		async listProjects(params) {
			const { data } = await client.get('/projects', { params })
			return data
		},

		async getProject(id) {
			const { data } = await client.get(`/projects/${id}`)
			return data
		},

		async createProject(payload) {
			const { data } = await client.post('/projects', payload)
			return data
		},

		async updateProject(id, payload): Promise<UpdateProjectResponse> {
			const { data } = await client.put(`/projects/${id}`, payload)
			return data
		},

		async deleteProject(id): Promise<void> {
			await client.delete(`/projects/${id}`)
		},

		async toggleFavoriteProject(id) {
			const { data } = await client.post(`/projects/${id}/favorite`)
			return data
		},

		async uploadBackground(id, file) {
			const formData = new FormData()
			formData.append('file', file)
			const { data } = await client.post(`/projects/${id}/background`, formData, {
				headers: { 'Content-Type': 'multipart/form-data' }
			})
			return data
		}
	}
}
