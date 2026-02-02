export interface ProjectState {
	projects: Project[]
	filters: ProjectFilters
	searchHistory: string[]
	isLoading: boolean
	error: string | null
}

export const initialState = (): ProjectState => ({
	projects: [],
	filters: {
		search: '',
		showFavoritesOnly: false,
		sortBy: 'alphabetical'
	},
	searchHistory: [],
	isLoading: false,
	error: null
})
