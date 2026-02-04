import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

import { ProjectStatus } from '#shared/types/project'
import ClsProjectCard from '@/components/ui/common/ClsProjectCard.vue'

const { 
	toggleFavoriteMock, 
	deleteProjectMock, 
	dialogOpenMock 
} = vi.hoisted(() => {
	return {
		toggleFavoriteMock: vi.fn(),
		deleteProjectMock: vi.fn(),
		dialogOpenMock: vi.fn()
	}
})

mockNuxtImport('useProject', () => {
	return () => ({
		toggleFavorite: toggleFavoriteMock,
		deleteProject: deleteProjectMock
	})
})

mockNuxtImport('useConfirmationDialog', () => {
	return () => ({
		open: dialogOpenMock
	})
})

describe('ClsProjectCard', () => {
	it('calls toggleFavorite on favorite click', async () => {
		const wrapper = mount(ClsProjectCard, {
			props: {
				project: {
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
			},
			global: {
				stubs: {
					Icon: { template: '<span />' },
					ClsProjectCardActions: { template: '<button type="button" data-test="remove" @click="$emit(\'remove\')">x</button>' }
				}
			}
		})

		toggleFavoriteMock.mockReset()
		await wrapper.findAll('div').find((d) => d.classes().includes('cursor-pointer'))!.trigger('click')
		expect(toggleFavoriteMock).toHaveBeenCalledWith('p1')
	})

	it('opens confirmation dialog and calls deleteProject on confirm', async () => {
		const wrapper = mount(ClsProjectCard, {
			props: {
				project: {
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
			},
			global: {
				stubs: {
					Icon: { template: '<span />' },
					ClsProjectCardActions: { template: '<button type="button" data-test="remove" @click="$emit(\'remove\')">x</button>' }
				}
			}
		})

		dialogOpenMock.mockReset()
		deleteProjectMock.mockReset()

		await wrapper.get('[data-test="remove"]').trigger('click')
		expect(dialogOpenMock).toHaveBeenCalledTimes(1)

		const args = dialogOpenMock.mock.calls[0]?.[0] as any
		expect(args.projectName).toBe('Alpha')

		args.onConfirm()
		expect(deleteProjectMock).toHaveBeenCalledWith('p1')
	})
})
