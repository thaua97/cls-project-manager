import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import ClsButton from '@/components/ui/common/ClsButton.vue'

describe('ClsButton', () => {
	it('renders slot and applies variant/size classes', () => {
		const wrapper = mount(ClsButton, {
			props: {
				variant: 'outline',
				size: 'sm'
			},
			slots: {
				default: 'Click'
			}
		})

		expect(wrapper.text()).toContain('Click')
		expect(wrapper.attributes('class')).toContain('border-2')
		expect(wrapper.attributes('class')).toContain('h-[40px]')
	})

	it('emits click', async () => {
		const wrapper = mount(ClsButton, {
			slots: {
				default: 'Click'
			}
		})

		await wrapper.trigger('click')
		expect(wrapper.emitted('click')?.length).toBe(1)
	})
})
