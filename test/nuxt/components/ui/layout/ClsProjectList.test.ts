import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import ClsProjectList from '@/components/ui/layout/ClsProjectList.vue'

describe('ClsProjectList', () => {
	it('renders skeletons when loading', () => {
		const wrapper = mount(ClsProjectList, {
			props: {
				loading: true,
				skeletonCount: 3
			}
		})

		expect(wrapper.findAll('[class*="animate-pulse"]').length).toBe(3)
	})

	it('renders slot content', () => {
		const wrapper = mount(ClsProjectList, {
			slots: {
				default: '<div data-test="card">Card</div>'
			}
		})

		expect(wrapper.find('[data-test="card"]').exists()).toBe(true)
	})
})
