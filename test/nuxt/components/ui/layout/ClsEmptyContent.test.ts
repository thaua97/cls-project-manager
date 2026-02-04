import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

import ClsEmptyContent from '@/components/ui/layout/ClsEmptyContent.vue'

const navigateToMock = vi.hoisted(() => vi.fn())

mockNuxtImport('navigateTo', () => navigateToMock)

describe('ClsEmptyContent', () => {
	it('navigates to /project/new when clicking action button', async () => {
		const wrapper = mount(ClsEmptyContent, {
			props: {
				title: 'Empty',
				description: 'No projects',
				buttonText: 'Novo Projeto'
			},
			global: {
				stubs: {
					Icon: { template: '<span />' },
					ClsButton: {
						emits: ['click'],
						template: '<button type="button" @click="$emit(\'click\', $event)"><slot /></button>'
					}
				}
			}
		})

		await wrapper.get('button').trigger('click')
		expect(navigateToMock).toHaveBeenCalledWith('/project/new')
	})
})
