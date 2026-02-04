import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import ClsToolbar from '@/components/ui/layout/ClsToolbar.vue'

describe('ClsToolbar', () => {
	it('emits updates from v-model bindings and create', async () => {
		const wrapper = mount(ClsToolbar, {
			props: {
				total: 10,
				sortBy: 'alphabetical',
				showFavoritesOnly: false
			},
			global: {
				stubs: {
					Icon: { template: '<span />' },
					USeparator: { template: '<div />' },
					UFormField: { template: '<div><slot /></div>' },
					UPopover: { template: '<div><slot /><slot name="content" /></div>' },
					UButton: {
						template: '<button type="button" @click="$emit(\'click\')"><slot /></button>'
					},
					URadioGroup: {
						name: 'URadioGroup',
						props: ['modelValue', 'items'],
						emits: ['update:modelValue'],
						template: '<div />'
					},
					USwitch: {
						name: 'USwitch',
						props: ['modelValue'],
						emits: ['update:modelValue'],
						template: '<div />'
					},
					USelect: {
						name: 'USelect',
						props: ['modelValue', 'items'],
						emits: ['update:modelValue'],
						template: '<div />'
					},
					ClsButton: {
						name: 'ClsButton',
						emits: ['click'],
						template: '<button type="button" @click="$emit(\'click\', $event)"><slot /></button>'
					}
				}
			}
		})

		wrapper.findComponent({ name: 'USwitch' }).vm.$emit('update:modelValue', true)
		expect(wrapper.emitted('update:showFavoritesOnly')?.[0]).toEqual([true])

		wrapper.findComponent({ name: 'USelect' }).vm.$emit('update:modelValue', 'endDate')
		expect(wrapper.emitted('update:sortBy')?.[0]).toEqual(['endDate'])

		wrapper.findComponent({ name: 'ClsButton' }).vm.$emit('click', new MouseEvent('click'))
		expect(wrapper.emitted('create')?.length).toBe(1)
	})
})
