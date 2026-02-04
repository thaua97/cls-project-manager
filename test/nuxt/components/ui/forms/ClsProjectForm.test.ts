import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

type RefLike<T> = { value: T }

const authMocks = vi.hoisted(() => {
	return {
		isGuest: { value: false } as RefLike<boolean>
	}
})

mockNuxtImport('useAuth', () => {
	return () => ({
		isGuest: authMocks.isGuest
	})
})

describe('ClsProjectForm', () => {
	const loadComponent = async () => {
		vi.resetModules()
		const mod = await import('@/components/ui/forms/ClsProjectForm.vue')
		return mod.default
	}

	it('emits submit with current background file', async () => {
		authMocks.isGuest.value = false

		const file = new File(['x'], 'a.png', { type: 'image/png' })

		const ClsProjectForm = await loadComponent()
		const wrapper = mount(ClsProjectForm, {
			props: {
				modelValue: {
					name: 'Alpha',
					client: 'Client',
					startDate: '2025-01-01',
					endDate: '2025-01-02',
					backgroundUrl: undefined
				},
				loading: false
			},
			global: {
				stubs: {
					UForm: {
						name: 'UForm',
						emits: ['submit'],
						template: '<form @submit="$emit(\'submit\', $event)"><slot /></form>'
					},
					UFormField: { template: '<div><slot /></div>' },
					UInput: {
						props: ['modelValue'],
						emits: ['update:modelValue'],
						template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />'
					},
					ClsProjectFormDataGroup: { template: '<div />' },
					ClsButton: { template: '<button type="submit"><slot /></button>' },
					ClsUploadFile: {
						props: ['modelValue'],
						emits: ['update:modelValue'],
						template: '<button type="button" data-test="set-file" @click="$emit(\'update:modelValue\', file)">set</button>',
						data() {
							return { file }
						}
					}
				}
			}
		})

		await wrapper.get('[data-test="set-file"]').trigger('click')
		await wrapper.get('form').trigger('submit')

		expect(wrapper.emitted('submit')?.[0]?.[0]).toBeInstanceOf(File)
	})

	it('hides upload field when guest', async () => {
		authMocks.isGuest.value = true

		const ClsProjectForm = await loadComponent()
		const wrapper = mount(ClsProjectForm, {
			props: {
				modelValue: {
					name: 'Alpha',
					client: 'Client',
					startDate: '2025-01-01',
					endDate: '2025-01-02',
					backgroundUrl: undefined
				}
			},
			global: {
				stubs: {
					UForm: { template: '<div><slot /></div>' },
					UFormField: { template: '<div><slot /></div>' },
					UInput: { template: '<input />' },
					ClsProjectFormDataGroup: { template: '<div />' },
					ClsButton: { template: '<button />' },
					ClsUploadFile: { template: '<div data-test="upload" />' }
				}
			}
		})

		expect(wrapper.find('[data-test="upload"]').exists()).toBe(false)
	})
})
