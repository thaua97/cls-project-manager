import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

import ClsProjectSearch from '@/components/ui/layout/ClsProjectSearch.vue'

const { outsideCallback, escapeCallback } = vi.hoisted(() => {
	return {
		outsideCallback: { value: undefined as undefined | (() => void) },
		escapeCallback: { value: undefined as undefined | (() => void) }
	}
})

mockNuxtImport('onClickOutside', () => {
	return (_target: unknown, cb: () => void) => {
		outsideCallback.value = cb
	}
})

mockNuxtImport('onKeyStroke', () => {
	return (key: string, cb: () => void) => {
		if (key === 'Escape') {
			escapeCallback.value = cb
		}
	}
})

describe('ClsProjectSearch', () => {
	it('emits update:open when clicking trigger button', async () => {
		const wrapper = mount(ClsProjectSearch, {
			props: {
				open: false,
				searchTerm: '',
				loading: false,
				groups: []
			},
			global: {
				stubs: {
					Teleport: true,
					Icon: { template: '<span />' },
					UCommandPalette: { template: '<div />' }
				}
			}
		})

		await wrapper.get('button').trigger('click')

		expect(wrapper.emitted('update:open')?.[0]).toEqual([true])
	})

	it('emits update:open false on outside click and Escape when open', async () => {
		const wrapper = mount(ClsProjectSearch, {
			props: {
				open: true,
				searchTerm: '',
				loading: false,
				groups: []
			},
			global: {
				stubs: {
					Teleport: true,
					Icon: { template: '<span />' },
					UCommandPalette: { template: '<div />' }
				}
			}
		})

		outsideCallback.value?.()
		escapeCallback.value?.()

		expect(wrapper.emitted('update:open')?.some((e) => e[0] === false)).toBe(true)
	})

	it('proxies search/select events from UCommandPalette and removes history item', async () => {
		const wrapper = mount(ClsProjectSearch, {
			props: {
				open: true,
				searchTerm: '',
				loading: false,
				groups: []
			},
			global: {
				stubs: {
					Teleport: true,
					Icon: { template: '<span />' },
					UCommandPalette: {
						name: 'UCommandPalette',
						props: ['groups', 'loading', 'searchTerm'],
						emits: ['update:search-term', 'update:model-value'],
						template:
							'<div>' +
							'<button type="button" data-test="remove" @click="$emit(\'update:search-term\', \'abc\')">t</button>' +
							'<button type="button" data-test="select" @click="$emit(\'update:model-value\', \'id\')">t</button>' +
							'<slot name="history-trailing" :item="{ term: \'term1\' }" />' +
							'</div>'
					}
				}
			}
		})

		await wrapper.get('[data-test="remove"]').trigger('click')
		await wrapper.get('[data-test="select"]').trigger('click')

		expect(wrapper.emitted('update:searchTerm')?.[0]).toEqual(['abc'])
		expect(wrapper.emitted('select')?.[0]).toEqual(['id'])

		await wrapper.get('button[class*="ml-auto"]').trigger('click')
		expect(wrapper.emitted('removeHistoryItem')?.[0]).toEqual(['term1'])
	})
})
