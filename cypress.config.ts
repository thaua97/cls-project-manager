import { defineConfig } from 'cypress'

export default defineConfig({
	e2e: {
		baseUrl: 'http://localhost:3000',
		viewportWidth: 1280,
		viewportHeight: 720,
		video: false,
		screenshotOnRunFailure: true,
		defaultCommandTimeout: 10000,
		requestTimeout: 10000,
		responseTimeout: 10000,
		retries: {
			runMode: 2,
			openMode: 0
		},
		specPattern: 'cypress/e2e/**/*.cy.{js,ts}',
		supportFile: 'cypress/support/e2e.ts',
		fixturesFolder: 'cypress/fixtures'
	}
})
