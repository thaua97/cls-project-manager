export interface ProjectState {
	projects: Project[]
	filters: ProjectFilters
	searchHistory: string[]
	hasHydratedSearchHistory: boolean
	isLoading: boolean
	error: string | null
	fetchToken: number
}

export const initialState = (): ProjectState => ({
	projects: [],
	filters: {
		search: '',
		showFavoritesOnly: false,
		sortBy: 'alphabetical'
	},
	searchHistory: [],
	hasHydratedSearchHistory: false,
	isLoading: false,
	error: null,
	fetchToken: 0
})
