import { describe, expect, it } from 'vitest'

import { useProjectStore } from '@/stores/project'

describe('project store - search history', () => {
	it('addToSearchHistory only persists terms with 3+ chars and keeps max 5 unique', () => {
		const store = useProjectStore()

		store.addToSearchHistory('ab')
		expect(store.searchHistory).toHaveLength(0)

		store.addToSearchHistory('abc')
		store.addToSearchHistory('abcd')
		store.addToSearchHistory('abcde')
		store.addToSearchHistory('abcdef')
		store.addToSearchHistory('abcdefg')
		store.addToSearchHistory('abc')

		expect(store.searchHistory[0]).toBe('abc')
		expect(store.searchHistory).toHaveLength(5)
		const unique = new Set(store.searchHistory)
		expect(unique.size).toBe(store.searchHistory.length)
	})
})
