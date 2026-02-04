import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

import ClsProjectCardActions from '@/components/ui/dialogs/ClsProjectCardActions.vue'

const navigateToMock = vi.hoisted(() => vi.fn())

mockNuxtImport('navigateTo', () => navigateToMock)

describe('ClsProjectCardActions', () => {
	it('navigates to edit route and emits remove', async () => {
		const wrapper = mount(ClsProjectCardActions, {
			props: { id: 'p1' },
			global: {
				stubs: {
					UDropdownMenu: {
						name: 'UDropdownMenu',
						props: ['items'],
						template:
							'<div>' +
							'<button v-for="it in items" :key="it.label" type="button" @click="it.onSelect && it.onSelect()">{{ it.label }}</button>' +
							'<slot />' +
							'</div>'
					},
					UButton: { template: '<button />' }
				}
			}
		})

		const buttons = wrapper.findAll('button')
		await buttons[0]!.trigger('click')
		expect(navigateToMock).toHaveBeenCalledWith('/project/p1')

		await buttons[1]!.trigger('click')
		expect(wrapper.emitted('remove')?.length).toBe(1)
	})
})
