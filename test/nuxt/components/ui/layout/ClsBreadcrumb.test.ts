import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import ClsBreadcrumb from '@/components/ui/layout/ClsBreadcrumb.vue'

describe('ClsBreadcrumb', () => {
	it('uses default title when not provided', () => {
		const wrapper = mount(ClsBreadcrumb, {
			global: {
				stubs: {
					NuxtLink: { template: '<a><slot /></a>' },
					Icon: { template: '<span />' }
				}
			}
		})

		expect(wrapper.text()).toContain('Novo Projeto')
	})

	it('renders custom title', () => {
		const wrapper = mount(ClsBreadcrumb, {
			props: {
				title: 'Editar Projeto'
			},
			global: {
				stubs: {
					NuxtLink: { template: '<a><slot /></a>' },
					Icon: { template: '<span />' }
				}
			}
		})

		expect(wrapper.text()).toContain('Editar Projeto')
	})
})
