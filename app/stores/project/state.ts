export interface ProjectState {
	projects: Project[]
	filters: ProjectFilters
	searchHistory: string[]
	isLoading: boolean
	error: string | null
}

export const initialState = (): ProjectState => ({
	projects: [
		{
			id: 'p-001',
			name: 'Portal do Cliente',
			client: 'Renner',
			startDate: '2026-01-10',
			endDate: '2026-03-15',
			status: ProjectStatus.IN_PROGRESS,
			isFavorite: true,
			createdAt: '2026-01-10T09:30:00.000Z',
			updatedAt: '2026-01-25T14:12:00.000Z'
		},
		{
			id: 'p-002',
			name: 'App Mobile - MVP',
			client: 'Clicksign',
			startDate: '2026-02-01',
			endDate: '2026-04-20',
			status: ProjectStatus.NOT_STARTED,
			isFavorite: false,
			createdAt: '2026-01-28T11:00:00.000Z',
			updatedAt: '2026-01-28T11:00:00.000Z'
		},
		{
			id: 'p-003',
			name: 'Integração ERP',
			client: 'Ferrari',
			startDate: '2025-11-05',
			endDate: '2026-01-30',
			status: ProjectStatus.COMPLETED,
			isFavorite: false,
			createdAt: '2025-11-05T10:00:00.000Z',
			updatedAt: '2026-01-30T18:00:00.000Z'
		},
		{
			id: 'p-004',
			name: 'Dashboard de Métricas',
			client: 'Meta AI',
			startDate: '2026-01-18',
			endDate: '2026-02-28',
			status: ProjectStatus.ON_HOLD,
			isFavorite: true,
			createdAt: '2026-01-18T08:15:00.000Z',
			updatedAt: '2026-01-29T16:40:00.000Z'
		}
	],
	filters: {
		search: '',
		showFavoritesOnly: false,
		sortBy: 'alphabetical'
	},
	searchHistory: [],
	isLoading: false,
	error: null
})
