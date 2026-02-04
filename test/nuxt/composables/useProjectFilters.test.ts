import { describe, expect, it, vi } from 'vitest'

import { useProjectStore } from '@/stores/project'
import { useProjectFilters } from '@/composables/useProjectFilters'

describe('useProjectFilters', () => {
	it('computed setters call store actions', () => {
		const store = useProjectStore()
		const setSearchSpy = vi.spyOn(store, 'setSearch')
		const setShowFavoritesOnlySpy = vi.spyOn(store, 'setShowFavoritesOnly')
		const setSortBySpy = vi.spyOn(store, 'setSortBy')

		const filters = useProjectFilters()

		filters.search.value = 'abc'
		filters.showFavoritesOnly.value = true
		filters.sortBy.value = 'endDate'

		expect(setSearchSpy).toHaveBeenCalledWith('abc')
		expect(setShowFavoritesOnlySpy).toHaveBeenCalledWith(true)
		expect(setSortBySpy).toHaveBeenCalledWith('endDate')
	})

	it('helper methods call store actions', () => {
		const store = useProjectStore()
		const clearSearchSpy = vi.spyOn(store, 'clearSearch')
		const clearFiltersSpy = vi.spyOn(store, 'clearFilters')
		const toggleFavoritesFilterSpy = vi.spyOn(store, 'toggleFavoritesFilter')

		const filters = useProjectFilters()

		filters.clearSearch()
		filters.clearFilters()
		filters.toggleFavoritesFilter()

		expect(clearSearchSpy).toHaveBeenCalledTimes(1)
		expect(clearFiltersSpy).toHaveBeenCalledTimes(1)
		expect(toggleFavoritesFilterSpy).toHaveBeenCalledTimes(1)
	})
})
