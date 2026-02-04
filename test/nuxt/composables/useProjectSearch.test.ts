import { describe, expect, it, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { nextTick } from 'vue'

import { useProjectStore } from '@/stores/project'
import { useProjectSearch } from '@/composables/useProjectSearch'
import { ProjectStatus } from '#shared/types/project'

const { listProjectsMock } = vi.hoisted(() => {
	return {
		listProjectsMock: vi.fn()
	}
})

mockNuxtImport('useProjectsApi', () => {
	return () => ({
		listProjects: listProjectsMock
	})
})

mockNuxtImport('useDebounceFn', () => {
	type AnyFn = (...args: unknown[]) => unknown
	return <T extends AnyFn>(fn: T, _wait?: number): T => fn
})

describe('useProjectSearch', () => {
	it('hydrates history when opening and adds term when closing', async () => {
		const store = useProjectStore()
		const hydrateSpy = vi.spyOn(store, 'hydrateSearchHistory')
		const addSpy = vi.spyOn(store, 'addToSearchHistory')

		const search = useProjectSearch()

		search.searchTerm.value = 'alpha'
		search.open.value = true
		await nextTick()

		expect(hydrateSpy).toHaveBeenCalledTimes(1)

		search.open.value = false
		await nextTick()

		expect(addSpy).toHaveBeenCalledWith('alpha')
	})

	it('fetches results when term length >= 3 and exposes groups', async () => {
		listProjectsMock.mockResolvedValue({
			success: true,
			total: 1,
			projects: [
				{
					id: 'p1',
					name: 'Alpha',
					client: 'Client',
					backgroundUrl: undefined,
					startDate: '2025-01-01T00:00:00.000Z',
					endDate: '2025-01-02T00:00:00.000Z',
					userId: 'u',
					status: ProjectStatus.NOT_STARTED,
					isFavorite: false,
					createdAt: '2025-01-01T00:00:00.000Z',
					updatedAt: '2025-01-01T00:00:00.000Z'
				}
			]
		})

		const store = useProjectStore()
		const fetchSpy = vi.spyOn(store, 'fetchProjects')

		const search = useProjectSearch()
		search.searchTerm.value = 'alp'

		await nextTick()
		await nextTick()

		expect(fetchSpy).toHaveBeenCalledTimes(1)
		expect(search.groups.value.find((g) => g.id === 'results')).toBeTruthy()
	})

	it('getProjectNameParts returns highlight parts only when term >= 3', async () => {
		const store = useProjectStore()
		store.projects = [
			{
				id: 'p1',
				name: 'Alpha',
				client: 'Client',
				backgroundUrl: undefined,
				startDate: '2025-01-01T00:00:00.000Z',
				endDate: '2025-01-02T00:00:00.000Z',
				userId: 'u',
				status: ProjectStatus.NOT_STARTED,
				isFavorite: false,
				createdAt: '2025-01-01T00:00:00.000Z',
				updatedAt: '2025-01-01T00:00:00.000Z'
			}
		]

		const search = useProjectSearch()

		search.searchTerm.value = 'al'
		await nextTick()
		expect(search.getProjectNameParts(store.projects[0]!).length).toBe(0)

		search.searchTerm.value = 'alp'
		await nextTick()

		const parts = search.getProjectNameParts(store.projects[0]!)
		expect(parts.length).toBeGreaterThan(0)
		expect(parts.some((p) => p.highlight)).toBe(true)
	})
})
