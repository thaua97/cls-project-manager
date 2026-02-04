import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import ClsConfirmationDialog from '@/components/ui/dialogs/ClsConfirmationDialog.vue'

describe('ClsConfirmationDialog', () => {
	it('emits confirm and closes (update:modelValue false)', async () => {
		const wrapper = mount(ClsConfirmationDialog, {
			props: {
				modelValue: true,
				projectName: 'Alpha'
			},
			global: {
				stubs: {
					UIcon: { template: '<span />' },
					UModal: {
						name: 'UModal',
						props: ['open'],
						emits: ['update:open'],
						template:
							'<div><slot name="content" :close="close" /></div>',
						methods: {
							close() {
								this.$emit('update:open', false)
							}
						}
					},
					ClsButton: {
						emits: ['click'],
						template: '<button type="button" @click="$emit(\'click\')"><slot /></button>'
					}
				}
			}
		})

		const btn = wrapper.findAll('button').find((b) => b.text().includes('Confirmar'))
		expect(btn).toBeTruthy()
		await btn!.trigger('click')

		expect(wrapper.emitted('confirm')?.length).toBe(1)
		expect(wrapper.emitted('update:modelValue')?.some((e) => e[0] === false)).toBe(true)
	})

	it('emits cancel and closes (update:modelValue false)', async () => {
		const wrapper = mount(ClsConfirmationDialog, {
			props: {
				modelValue: true,
				projectName: 'Alpha'
			},
			global: {
				stubs: {
					UIcon: { template: '<span />' },
					UModal: {
						name: 'UModal',
						props: ['open'],
						emits: ['update:open'],
						template:
							'<div><slot name="content" :close="close" /></div>',
						methods: {
							close() {
								this.$emit('update:open', false)
							}
						}
					},
					ClsButton: {
						emits: ['click'],
						template: '<button type="button" @click="$emit(\'click\')"><slot /></button>'
					}
				}
			}
		})

		const btn = wrapper.findAll('button').find((b) => b.text().includes('Cancelar'))
		expect(btn).toBeTruthy()
		await btn!.trigger('click')

		expect(wrapper.emitted('cancel')?.length).toBe(1)
		expect(wrapper.emitted('update:modelValue')?.some((e) => e[0] === false)).toBe(true)
	})
})
