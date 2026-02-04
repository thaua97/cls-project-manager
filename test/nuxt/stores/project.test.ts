import { describe, expect, it, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

import { useProjectStore } from '@/stores/project'
import type { Project } from '#shared/types/project'
import { ProjectStatus } from '#shared/types/project'

type ListProjectsResult =
	| {
			success: true
			total: number
			projects: Project[]
	  }
	| {
			success: false
			error: string
	  }

const { listProjectsMock } = vi.hoisted(() => {
	return {
		listProjectsMock: vi.fn<
			(params?: { favorites?: boolean; sort?: string; query?: string }) =>
				Promise<ListProjectsResult>
		>()
	}
})

mockNuxtImport('useProjectsApi', () => {
	return () => {
		return {
			listProjects: listProjectsMock,
			createProject: vi.fn(),
			updateProject: vi.fn(),
			deleteProject: vi.fn(),
			toggleFavorite: vi.fn(),
			uploadBackground: vi.fn(),
			getProject: vi.fn()
		}
	}
})

describe('project store - fetchProjects', () => {
	it('applies query only when search has 3+ chars', async () => {
		listProjectsMock.mockResolvedValue({
			success: true,
			total: 0,
			projects: []
		})

		const store = useProjectStore()

		store.setSearch('ab')
		await store.fetchProjects()
		expect(listProjectsMock).toHaveBeenLastCalledWith({
			favorites: false,
			sort: 'name_asc'
		})

		store.setSearch('abc')
		await store.fetchProjects()
		expect(listProjectsMock).toHaveBeenLastCalledWith({
			favorites: false,
			sort: 'name_asc',
			query: 'abc'
		})
	})

	it('maps sortBy to api sort param', async () => {
		listProjectsMock.mockResolvedValue({
			success: true,
			total: 0,
			projects: []
		})

		const store = useProjectStore()

		store.setSortBy('startDate')
		await store.fetchProjects()
		expect(listProjectsMock).toHaveBeenLastCalledWith({
			favorites: false,
			sort: 'startDate_desc'
		})

		store.setSortBy('endDate')
		await store.fetchProjects()
		expect(listProjectsMock).toHaveBeenLastCalledWith({
			favorites: false,
			sort: 'endDate_asc'
		})
	})

	it('filters favorites when enabled', async () => {
		listProjectsMock.mockResolvedValue({
			success: true,
			total: 0,
			projects: []
		})

		const store = useProjectStore()
		store.setShowFavoritesOnly(true)
		await store.fetchProjects()

		expect(listProjectsMock).toHaveBeenLastCalledWith({
			favorites: true,
			sort: 'name_asc'
		})
	})

	it('ignores out-of-order responses (fetchToken)', async () => {
		const projectA = {
			id: 'a',
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

		const projectB = {
			...projectA,
			id: 'b',
			name: 'Beta'
		}

		let resolveFirst: (value: ListProjectsResult) => void
		let resolveSecond: (value: ListProjectsResult) => void

		const first = new Promise<ListProjectsResult>((resolve) => {
			resolveFirst = resolve
		})
		const second = new Promise<ListProjectsResult>((resolve) => {
			resolveSecond = resolve
		})

		listProjectsMock
			.mockImplementationOnce(() => first)
			.mockImplementationOnce(() => second)

		const store = useProjectStore()

		store.setSearch('first')
		const p1 = store.fetchProjects()

		store.setSearch('second')
		const p2 = store.fetchProjects()

		resolveSecond!({ success: true, total: 1, projects: [projectB] })
		await p2

		resolveFirst!({ success: true, total: 1, projects: [projectA] })
		await p1

		expect(store.projects).toHaveLength(1)
		expect(store.projects[0]?.id).toBe('b')
	})
})
