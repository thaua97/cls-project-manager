import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import ClsUploadFile from '@/components/ui/forms/ClsUploadFile.vue'

describe('ClsUploadFile', () => {
	it('calls open() from UFileUpload actions slot', async () => {
		const openMock = vi.fn()

		const wrapper = mount(ClsUploadFile, {
			props: {
				modelValue: null
			},
			global: {
				stubs: {
					UFileUpload: {
						props: ['modelValue'],
						emits: ['update:modelValue'],
						template:
							'<div>' +
							'<slot name="actions" :open="open" />' +
							'</div>',
						methods: {
							open() {
								openMock()
							}
						}
					},
					ClsButton: {
						emits: ['click'],
						template: '<button type="button" @click="$emit(\'click\', $event)"><slot /></button>'
					}
				}
			}
		})

		await wrapper.get('button').trigger('click')
		expect(openMock).toHaveBeenCalledTimes(1)
	})

	it('sets model to null and calls removeFile()', async () => {
		const removeFileMock = vi.fn()
		const file = new File(['x'], 'a.png', { type: 'image/png' })

		const wrapper = mount(ClsUploadFile, {
			props: {
				modelValue: file
			},
			global: {
				stubs: {
					UFileUpload: {
						props: ['modelValue'],
						emits: ['update:modelValue'],
						template:
							'<div>' +
							'<slot name="files-bottom" :removeFile="removeFile" :files="files" />' +
							'</div>',
						computed: {
							files(): unknown {
								return this.modelValue ? [this.modelValue] : null
							}
						},
						methods: {
							removeFile() {
								removeFileMock()
							}
						}
					},
					ClsButton: {
						emits: ['click'],
						template: '<button type="button" @click="$emit(\'click\', $event)"><slot /></button>'
					}
				}
			}
		})

		await wrapper.get('button').trigger('click')

		expect(removeFileMock).toHaveBeenCalledTimes(1)
		expect(wrapper.emitted('update:modelValue')?.some((e) => e[0] === null)).toBe(true)
	})
})
