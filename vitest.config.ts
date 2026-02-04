import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
	test: {
		environment: 'nuxt',
		include: ['test/**/*.test.ts'],
		setupFiles: ['test/nuxt/setup.ts'],
		environmentOptions: {
			nuxt: {
				domEnvironment: 'happy-dom',
				mock: {
					intersectionObserver: true
				}
			}
		}
	}
})
