import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

import { useAuthStore } from '@/stores/auth'
import { useProjectsApi } from '@/composables/useProjectsApi'
import { ProjectStatus } from '#shared/types/project'

const apiMocks = vi.hoisted(() => {
	return {
		listProjects: vi.fn(),
		getProject: vi.fn(),
		createProject: vi.fn(),
		updateProject: vi.fn(),
		deleteProject: vi.fn(),
		toggleFavoriteProject: vi.fn(),
		uploadBackground: vi.fn()
	}
})

mockNuxtImport('useClsPmApi', () => {
	return () => apiMocks
})

type CookieRef<T> = { value: T }

type GlobalWithUseCookie = typeof globalThis & {
	useCookie?: <T>(name: string, opts?: unknown) => CookieRef<T>
}

const cookie = <T>(name: string): CookieRef<T> => {
	const useCookie = (globalThis as GlobalWithUseCookie).useCookie
	if (!useCookie) {
		throw new Error('useCookie mock not initialized. Check test/nuxt/setup.ts')
	}
	return useCookie<T>(name)
}

describe('useProjectsApi', () => {
	beforeEach(() => {
		apiMocks.listProjects.mockReset()
		apiMocks.getProject.mockReset()
		apiMocks.createProject.mockReset()
		apiMocks.updateProject.mockReset()
		apiMocks.deleteProject.mockReset()
		apiMocks.toggleFavoriteProject.mockReset()
		apiMocks.uploadBackground.mockReset()

		cookie<boolean>('cls_pm_guest').value = false
		cookie<string | null>('cls_pm_token').value = null
		cookie<string | null>('cls_pm_user_id').value = null
	})

	it('lists projects via API when not guest and maps to UI shape', async () => {
		apiMocks.listProjects.mockResolvedValue({
			total: 1,
			projects: [
				{
					id: 'p1',
					name: 'Alpha',
					client: 'Client',
					backgroundUrl: 'http://x',
					startDate: '2025-01-01T00:00:00.000Z',
					endDate: '2025-01-02T00:00:00.000Z',
					userId: 'u1',
					isFavorite: true,
					createdAt: '2025-01-01T00:00:00.000Z',
					updatedAt: '2025-01-01T00:00:00.000Z'
				}
			]
		})

		const api = useProjectsApi()
		const result = await api.listProjects({ sort: 'name_asc' })

		expect(result.success).toBe(true)
		if (!result.success) {return}

		expect(apiMocks.listProjects).toHaveBeenCalledWith({ sort: 'name_asc' })
		expect(result.total).toBe(1)
		expect(result.projects[0]).toMatchObject({
			id: 'p1',
			name: 'Alpha',
			client: 'Client',
			backgroundUrl: 'http://x',
			userId: 'u1',
			status: ProjectStatus.NOT_STARTED,
			isFavorite: true
		})
	})

	it('lists projects from localStorage when guest (favorites + query>=3 + sort)', async () => {
		cookie<boolean>('cls_pm_guest').value = true

		localStorage.setItem(
			'cls_pm_guest_projects',
			JSON.stringify([
				{
					id: 'a',
					name: 'Alpha',
					client: 'ACME',
					backgroundUrl: undefined,
					startDate: '2025-01-01T00:00:00.000Z',
					endDate: '2025-01-03T00:00:00.000Z',
					userId: '',
					status: ProjectStatus.NOT_STARTED,
					isFavorite: true,
					createdAt: '2025-01-01T00:00:00.000Z',
					updatedAt: '2025-01-01T00:00:00.000Z'
				},
				{
					id: 'b',
					name: 'Beta',
					client: 'Other',
					backgroundUrl: undefined,
					startDate: '2025-02-01T00:00:00.000Z',
					endDate: '2025-02-03T00:00:00.000Z',
					userId: '',
					status: ProjectStatus.NOT_STARTED,
					isFavorite: false,
					createdAt: '2025-02-01T00:00:00.000Z',
					updatedAt: '2025-02-01T00:00:00.000Z'
				}
			])
		)

		const api = useProjectsApi()
		const result = await api.listProjects({
			favorites: true,
			query: 'alp',
			sort: 'name_asc'
		})

		expect(result.success).toBe(true)
		if (!result.success) {return}

		expect(apiMocks.listProjects).not.toHaveBeenCalled()
		expect(result.total).toBe(1)
		expect(result.projects.map((p) => p.id)).toEqual(['a'])
	})

	it('createProject as guest writes to localStorage', async () => {
		cookie<boolean>('cls_pm_guest').value = true
		cookie<string | null>('cls_pm_user_id').value = 'guest-user'

		vi.stubGlobal('crypto', {
			randomUUID: () => 'uuid-1'
		})

		const api = useProjectsApi()
		const result = await api.createProject({
			name: 'New',
			client: 'Client',
			startDate: '2025-01-01T00:00:00.000Z',
			endDate: '2025-01-02T00:00:00.000Z'
		})

		expect(result.success).toBe(true)
		if (!result.success) {return}

		expect(result.project.id).toBe('uuid-1')
		const stored = JSON.parse(localStorage.getItem('cls_pm_guest_projects') || '[]')
		expect(stored).toHaveLength(1)
		expect(stored[0]).toMatchObject({
			id: 'uuid-1',
			name: 'New',
			client: 'Client',
			userId: 'guest-user'
		})
	})

	it('createProject via API fetches created project details', async () => {
		const auth = useAuthStore()
		auth.setToken('t')
		cookie<boolean>('cls_pm_guest').value = false

		apiMocks.createProject.mockResolvedValue({ id: 'p1' })
		apiMocks.getProject.mockResolvedValue({
			project: {
				id: 'p1',
				name: 'Alpha',
				client: 'Client',
				backgroundUrl: null,
				startDate: '2025-01-01T00:00:00.000Z',
				endDate: '2025-01-02T00:00:00.000Z',
				userId: 'u1',
				isFavorite: false,
				createdAt: '2025-01-01T00:00:00.000Z',
				updatedAt: '2025-01-01T00:00:00.000Z'
			}
		})

		const api = useProjectsApi()
		const result = await api.createProject({
			name: 'Alpha',
			client: 'Client',
			startDate: '2025-01-01T00:00:00.000Z',
			endDate: '2025-01-02T00:00:00.000Z'
		})

		expect(result.success).toBe(true)
		expect(apiMocks.createProject).toHaveBeenCalledWith({
			name: 'Alpha',
			client: 'Client',
			startDate: '2025-01-01T00:00:00.000Z',
			endDate: '2025-01-02T00:00:00.000Z'
		})
		expect(apiMocks.getProject).toHaveBeenCalledWith('p1')
	})
})
