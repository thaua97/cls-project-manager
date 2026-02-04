import { describe, expect, it, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

import { useProjectStore } from '@/stores/project'
import { useProject } from '@/composables/useProject'

const navigateToMock = vi.hoisted(() => vi.fn())

mockNuxtImport('navigateTo', () => {
	return navigateToMock
})

describe('useProject', () => {
	it('createProject uploads background when provided and navigates', async () => {
		const store = useProjectStore()
		vi.spyOn(store, 'createProject').mockResolvedValue(
			{ id: 'p1' } as unknown as Awaited<ReturnType<typeof store.createProject>>
		)
		const uploadSpy = vi
			.spyOn(store, 'uploadBackground')
			.mockResolvedValue(true)

		const { createProject } = useProject()
		const file = new File(['x'], 'bg.png', { type: 'image/png' })

		const result = await createProject(
			{
				name: 'Alpha',
				client: 'Client',
				startDate: '2025-01-01',
				endDate: '2025-01-02'
			},
			file
		)

		expect(result.success).toBe(true)
		expect(uploadSpy).toHaveBeenCalledWith('p1', file)
		expect(navigateToMock).toHaveBeenCalledWith('/')
	})

	it('createProject returns error when store fails', async () => {
		const store = useProjectStore()
		store.error = 'Erro'
		vi.spyOn(store, 'createProject').mockResolvedValue(null)

		const { createProject } = useProject()
		const result = await createProject({
			name: 'Alpha',
			client: 'Client',
			startDate: '2025-01-01',
			endDate: '2025-01-02'
		})

		expect(result.success).toBe(false)
		if (result.success) {return}
		expect(result.error).toBe('Erro')
	})

	it('updateProject uploads background and navigates on success', async () => {
		const store = useProjectStore()
		vi.spyOn(store, 'updateProject').mockResolvedValue(true)
		const uploadSpy = vi
			.spyOn(store, 'uploadBackground')
			.mockResolvedValue(true)

		const { updateProject } = useProject()
		const file = new File(['x'], 'bg.png', { type: 'image/png' })

		const result = await updateProject(
			{
				id: 'p1',
				name: 'Alpha'
			},
			file
		)

		expect(result.success).toBe(true)
		expect(uploadSpy).toHaveBeenCalledWith('p1', file)
		expect(navigateToMock).toHaveBeenCalledWith('/')
	})

	it('toggleFavorite returns success false when store fails', async () => {
		const store = useProjectStore()
		store.error = 'Erro'
		vi.spyOn(store, 'toggleFavorite').mockResolvedValue(false)

		const { toggleFavorite } = useProject()
		const result = await toggleFavorite('p1')

		expect(result.success).toBe(false)
		if (result.success) {return}
		expect(result.error).toBe('Erro')
	})
})
