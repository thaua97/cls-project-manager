import type {
	Project,
	CreateProjectInput,
	UpdateProjectInput,
	SortOption
} from '../../../shared/types/project'
import type { ProjectState } from './state'

const searchHistoryStorageKey = 'cls_pm_project_search_history'

const readSearchHistory = (): string[] => {
	if (typeof window === 'undefined') {
		return []
	}

	try {
		const raw = localStorage.getItem(searchHistoryStorageKey)
		if (!raw) {
			return []
		}
		const parsed = JSON.parse(raw) as unknown
		return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : []
	} catch (error) {
		console.error('Error reading search history:', error)
		return []
	}
}

const writeSearchHistory = (items: string[]) => {
	if (typeof window === 'undefined') {
		return
	}

	try {
		localStorage.setItem(searchHistoryStorageKey, JSON.stringify(items))
	} catch (error) {
		console.error('Error writing search history:', error)
	}
}

export const projectActions = {
	hydrateSearchHistory(this: ProjectState) {
		if (this.hasHydratedSearchHistory) {
			return
		}

		this.searchHistory = readSearchHistory()
		this.hasHydratedSearchHistory = true
	},

	persistSearchHistory(this: ProjectState) {
		writeSearchHistory(this.searchHistory)
	},

	async fetchProjects(this: ProjectState) {
		const token = this.fetchToken + 1
		this.fetchToken = token

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

			if (token !== this.fetchToken) {
				return
			}

			if (!result.success) {
				this.error = result.error
				return
			}

			this.projects = result.projects as unknown as Project[]
		} catch (error) {
			if (token === this.fetchToken) {
				this.error = 'Erro ao carregar projetos'
			}
			console.error('Error fetching projects:', error)
		} finally {
			if (token === this.fetchToken) {
				this.isLoading = false
			}
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

	async uploadBackground(
		this: ProjectState,
		id: string,
		file: File
	): Promise<boolean> {
		this.isLoading = true
		this.error = null

		try {
			const api = useProjectsApi()
			const result = await api.uploadBackground(id, file)

			if (!result.success) {
				this.error = result.error
				return false
			}

			const index = this.projects.findIndex((p: Project) => p.id === id)
			if (index !== -1) {
				this.projects[index] = result.project as unknown as Project
			}
			return true
		} catch (error) {
			this.error = 'Erro ao fazer upload da imagem'
			console.error('Error uploading background:', error)
			return false
		} finally {
			this.isLoading = false
		}
	},

	setSearch(this: ProjectState, search: string) {
		this.filters.search = search
	},

	addToSearchHistory(this: ProjectState, search: string) {
		const term = search.trim()
		if (term.length < 3) {
			return
		}

		const next = [term, ...this.searchHistory.filter((x) => x !== term)]
		this.searchHistory = next.slice(0, 5)
		writeSearchHistory(this.searchHistory)
	},

	removeSearchHistoryItem(this: ProjectState, search: string) {
		this.searchHistory = this.searchHistory.filter((x) => x !== search)
		writeSearchHistory(this.searchHistory)
	},

	clearSearchHistory(this: ProjectState) {
		this.searchHistory = []
		writeSearchHistory(this.searchHistory)
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
