import type { Project, SortOption } from '../../../shared/types/project'
import type { ProjectState } from './state'

export const projectGetters = {
	sortProjects: () => (projects: Project[], sortBy: SortOption): Project[] => {
		const sorted = [...projects]

		switch (sortBy) {
		case 'alphabetical':
			return sorted.sort((a, b) => a.name.localeCompare(b.name))
		case 'startDate':
			return sorted.sort((a, b) => {
				return new Date(b.startDate).getTime() -
							new Date(a.startDate).getTime()
			})
		case 'endDate':
			return sorted.sort((a, b) => {
				return new Date(a.endDate).getTime() -
							new Date(b.endDate).getTime()
			})
		default:
			return sorted
		}
	},

	filteredProjects(state: ProjectState): Project[] {
		let filtered = [...state.projects]

		if (state.filters.showFavoritesOnly) {
			filtered = filtered.filter(project => project.isFavorite)
		}

		if (state.filters.search.length >= 3) {
			const searchLower = state.filters.search.toLowerCase()
			filtered = filtered.filter(project =>
				project.name.toLowerCase().includes(searchLower) ||
				project.client.toLowerCase().includes(searchLower)
			)
		}

		return (this as any).sortProjects(filtered, state.filters.sortBy)
	},

	projectCount(): number {
		return this.filteredProjects.length
	},

	totalProjectCount(state: ProjectState): number {
		return state.projects.length
	},

	favoriteProjects(state: ProjectState): Project[] {
		return state.projects.filter(project => project.isFavorite)
	},

	getProjectById: (state: ProjectState) => (id: string): Project | undefined => {
		return state.projects.find(project => project.id === id)
	}
}
