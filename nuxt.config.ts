// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },
	css: ['@/assets/css/main.css'],
	modules: [
		'@nuxt/a11y',
		'@nuxt/eslint',
		'@nuxt/ui',
		'@nuxt/icon',
		'@pinia/nuxt',
		'@vueuse/nuxt'
	],
	components: [
		{
			path: '~/components',
			pathPrefix: false
		}
	],
	app: {
		head: {
			link: [
				{
					rel: 'preconnect',
					href: 'https://fonts.googleapis.com'
				},
				{
					rel: 'preconnect',
					href: 'https://fonts.gstatic.com',
					crossorigin: ''
				},
				{
					rel: 'stylesheet',
					href: 'https://fonts.googleapis.com/css2?family=Encode+Sans:wdth,wght@112.5,100..900&display=swap'
				}
			]
		}
	}
})