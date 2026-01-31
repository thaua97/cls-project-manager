import { useProjectStore } from '../stores/project'
import type { SortOption } from '../../shared/types/project'

export const useProjectFilters = () => {
	const store = useProjectStore()

	const search = computed({
		get: () => store.filters.search,
		set: (value: string) => store.setSearch(value)
	})

	const showFavoritesOnly = computed({
		get: () => store.filters.showFavoritesOnly,
		set: () => store.toggleFavoritesFilter()
	})

	const sortBy = computed({
		get: () => store.filters.sortBy,
		set: (value: SortOption) => store.setSortBy(value)
	})

	const searchHistory = computed(() => store.searchHistory)

	const clearSearch = () => {
		store.clearSearch()
	}

	const clearFilters = () => {
		store.clearFilters()
	}

	const toggleFavoritesFilter = () => {
		store.toggleFavoritesFilter()
	}

	const setSortBy = (option: SortOption) => {
		store.setSortBy(option)
	}

	return {
		search,
		showFavoritesOnly,
		sortBy,
		searchHistory,
		clearSearch,
		clearFilters,
		toggleFavoritesFilter,
		setSortBy
	}
}
