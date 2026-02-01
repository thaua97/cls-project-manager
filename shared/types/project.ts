export interface Project {
	id: string
	name: string
	client: string
	background?: string
	startDate: string
	endDate: string
	status: ProjectStatus
	isFavorite: boolean
	createdAt: string
	updatedAt: string
}

export enum ProjectStatus {
	NOT_STARTED = 'not_started',
	IN_PROGRESS = 'in_progress',
	COMPLETED = 'completed',
	ON_HOLD = 'on_hold'
}

export type SortOption = 'alphabetical' | 'startDate' | 'endDate'

export interface ProjectFilters {
	search: string
	showFavoritesOnly: boolean
	sortBy: SortOption
}

export interface CreateProjectInput {
	name: string
	client: string
	background?: string
	startDate: string
	endDate: string
	status: ProjectStatus
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {
	id: string
}
