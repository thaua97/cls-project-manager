import { describe, expect, it, vi } from 'vitest'

import { useProjectStore } from '@/stores/project'
import { useProjectList } from '@/composables/useProjectList'
import { ProjectStatus } from '#shared/types/project'

describe('useProjectList', () => {
	it('exposes store computed values', () => {
		const store = useProjectStore()
		store.projects = [
			{
				id: 'a',
				name: 'Alpha',
				client: 'Client',
				backgroundUrl: undefined,
				startDate: '2025-01-01T00:00:00.000Z',
				endDate: '2025-01-02T00:00:00.000Z',
				userId: 'u',
				status: ProjectStatus.NOT_STARTED,
				isFavorite: true,
				createdAt: '2025-01-01T00:00:00.000Z',
				updatedAt: '2025-01-01T00:00:00.000Z'
			}
		]

		const list = useProjectList()

		expect(list.totalProjectCount.value).toBe(1)
		expect(list.favoriteProjects.value).toHaveLength(1)
		expect(list.projectCount.value).toBe(list.projects.value.length)
	})

	it('fetchProjects calls store.fetchProjects', async () => {
		const store = useProjectStore()
		const spy = vi.spyOn(store, 'fetchProjects').mockResolvedValue(undefined)
		const list = useProjectList()

		await list.fetchProjects()

		expect(spy).toHaveBeenCalledTimes(1)
	})

	it('clearError calls store.clearError', () => {
		const store = useProjectStore()
		const spy = vi.spyOn(store, 'clearError')
		const list = useProjectList()

		list.clearError()

		expect(spy).toHaveBeenCalledTimes(1)
	})
})
