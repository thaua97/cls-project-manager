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
			this.projects = []
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
			const project: Project = {
				id: crypto.randomUUID(),
				...input,
				isFavorite: false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			}

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
			const index = this.projects.findIndex((p: Project) => p.id === input.id)
			if (index !== -1) {
				const { id: _id, ...updates } = input
				this.projects[index] = {
					...this.projects[index],
					...updates,
					updatedAt: new Date().toISOString()
				} as Project
				return true
			}
			return false
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
			const index = this.projects.findIndex((p: Project) => p.id === id)
			if (index !== -1) {
				this.projects.splice(index, 1)
				return true
			}
			return false
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
			const project = this.projects.find((p: Project) => p.id === id)
			if (project) {
				project.isFavorite = !project.isFavorite
				project.updatedAt = new Date().toISOString()
				return true
			}
			return false
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
