import type {
	Project,
	CreateProjectInput,
	UpdateProjectInput,
	SortOption
} from '../../../shared/types/project'
import type { ProjectState } from './state'

export const projectActions = {
	async fetchProjects(this: ProjectState) {
		this.isLoading = true
		this.error = null

		try {
			const api = useProjectsApi()

			const sortMap: Record<SortOption, 'name_asc' | 'startDate_desc' | 'endDate_asc'> = {
				alphabetical: 'name_asc',
				startDate: 'startDate_desc',
				endDate: 'endDate_asc'
			}

			const query =
				this.filters.search.length >= 3 ? this.filters.search : undefined

			const result = await api.listProjects({
				favorites: this.filters.showFavoritesOnly,
				sort: sortMap[this.filters.sortBy],
				...(query ? { query } : {})
			})

			if (!result.success) {
				this.error = result.error
				return
			}

			this.projects = result.projects as unknown as Project[]
		} catch (error) {
			this.error = 'Erro ao carregar projetos'
			console.error('Error fetching projects:', error)
		} finally {
			this.isLoading = false
		}
	},

	async createProject(
		this: ProjectState,
		input: CreateProjectInput
	): Promise<Project | null> {
		this.isLoading = true
		this.error = null

		try {
			const api = useProjectsApi()
			const result = await api.createProject(input)

			if (!result.success) {
				this.error = result.error
				return null
			}

			const project = result.project as unknown as Project
			this.projects.push(project)
			return project
		} catch (error) {
			this.error = 'Erro ao criar projeto'
			console.error('Error creating project:', error)
			return null
		} finally {
			this.isLoading = false
		}
	},

	async updateProject(
		this: ProjectState,
		input: UpdateProjectInput
	): Promise<boolean> {
		this.isLoading = true
		this.error = null

		try {
			const api = useProjectsApi()
			const { id, ...updates } = input

			const result = await api.updateProject(id, updates)
			if (!result.success) {
				this.error = result.error
				return false
			}

			const index = this.projects.findIndex((p: Project) => p.id === id)
			if (index === -1) {
				return false
			}

			this.projects[index] = result.project as unknown as Project
			return true
		} catch (error) {
			this.error = 'Erro ao atualizar projeto'
			console.error('Error updating project:', error)
			return false
		} finally {
			this.isLoading = false
		}
	},

	async deleteProject(this: ProjectState, id: string): Promise<boolean> {
		this.isLoading = true
		this.error = null

		try {
			const api = useProjectsApi()
			const result = await api.deleteProject(id)
			if (!result.success) {
				this.error = result.error
				return false
			}

			const index = this.projects.findIndex((p: Project) => p.id === id)
			if (index === -1) {
				return false
			}
			this.projects.splice(index, 1)
			return true
		} catch (error) {
			this.error = 'Erro ao remover projeto'
			console.error('Error deleting project:', error)
			return false
		} finally {
			this.isLoading = false
		}
	},

	async toggleFavorite(this: ProjectState, id: string): Promise<boolean> {
		try {
			this.error = null
			const api = useProjectsApi()
			const result = await api.toggleFavorite(id)

			if (!result.success) {
				this.error = result.error
				return false
			}

			const index = this.projects.findIndex((p: Project) => p.id === id)
			if (index === -1) {
				return false
			}

			this.projects[index] = result.project as unknown as Project
			return true
		} catch (error) {
			this.error = 'Erro ao favoritar projeto'
			console.error('Error toggling favorite:', error)
			return false
		}
	},

	setSearch(this: ProjectState, search: string) {
		this.filters.search = search

		if (search.length >= 3 && !this.searchHistory.includes(search)) {
			this.searchHistory.unshift(search)
			if (this.searchHistory.length > 5) {
				this.searchHistory = this.searchHistory.slice(0, 5)
			}
		}
	},

	toggleFavoritesFilter(this: ProjectState) {
		this.filters.showFavoritesOnly = !this.filters.showFavoritesOnly
	},

	setShowFavoritesOnly(this: ProjectState, value: boolean) {
		this.filters.showFavoritesOnly = value
	},

	setSortBy(this: ProjectState, sortBy: SortOption) {
		this.filters.sortBy = sortBy
	},

	clearSearch(this: ProjectState) {
		this.filters.search = ''
	},

	clearFilters(this: ProjectState) {
		this.filters = {
			search: '',
			showFavoritesOnly: false,
			sortBy: 'alphabetical'
		}
	},

	clearError(this: ProjectState) {
		this.error = null
	}
}
