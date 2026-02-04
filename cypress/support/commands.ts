/**
 * Comandos customizados do Cypress
 * Facilita operações comuns nos testes E2E
 */

declare global {
	namespace Cypress {
		interface Chainable {
			/**
			 * Faz login como usuário autenticado
			 */
			login(email: string, password: string): Chainable<void>

			/**
			 * Faz login como convidado (guest)
			 */
			loginAsGuest(): Chainable<void>

			/**
			 * Seleciona elemento por data-testid
			 */
			getByTestId(testId: string, options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>): Chainable<JQuery<HTMLElement>>

			/**
			 * Cria um projeto via API ou localStorage (guest)
			 */
			createProject(project: ProjectInput): Chainable<void>

			/**
			 * Limpa todos os projetos do localStorage (guest)
			 */
			clearGuestProjects(): Chainable<void>

			/**
			 * Configura interceptação de API com mock
			 */
			mockApi(method: string, url: string, response: object, statusCode?: number): Chainable<void>

			/**
			 * Aguarda carregamento da página principal
			 */
			waitForAppReady(): Chainable<void>
		}
	}
}

interface ProjectInput {
	name: string
	client: string
	startDate: string
	endDate: string
	isFavorite?: boolean
}

// Comando para selecionar por data-testid
Cypress.Commands.add('getByTestId', (testId: string, options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>) => {
	return cy.get(`[data-testid="${testId}"]`, options)
})

// Comando para login como convidado
Cypress.Commands.add('loginAsGuest', () => {
	cy.visit('/')
	cy.getByTestId('auth-guest-button').click()
	cy.getByTestId('logout-button', { timeout: 15000 }).should('be.visible')
	cy.get('[data-testid="projects-empty-state"], [data-testid="projects-list"]', {
		timeout: 20000
	}).should('exist')
})

// Comando para login com credenciais
Cypress.Commands.add('login', (email: string, password: string) => {
	cy.intercept('POST', '**/auth/login', {
		statusCode: 200,
		body: {
			bearer: 'fake-jwt-token-for-testing',
			userId: 'test-user-id'
		}
	}).as('loginRequest')

	cy.visit('/')
	cy.getByTestId('auth-modal-content').should('be.visible')
	cy.getByTestId('auth-modal-content').find('input[name="email"]').type(email)
	cy.getByTestId('auth-modal-content').find('input[name="password"]').type(password)
	cy.getByTestId('auth-submit-button').click()
	cy.wait('@loginRequest')
	cy.getByTestId('logout-button', { timeout: 15000 }).should('be.visible')
	cy.get('[data-testid="projects-empty-state"], [data-testid="projects-list"]', {
		timeout: 20000
	}).should('exist')
})

// Comando para criar projeto (modo guest via localStorage)
Cypress.Commands.add('createProject', (project: ProjectInput) => {
	cy.window().then((win) => {
		const storageKey = 'cls_pm_guest_projects'
		const existing = JSON.parse(win.localStorage.getItem(storageKey) || '[]')
		const now = new Date().toISOString()
		const newProject = {
			id: crypto.randomUUID(),
			name: project.name,
			client: project.client,
			startDate: project.startDate,
			endDate: project.endDate,
			backgroundUrl: undefined,
			userId: '',
			status: 'not_started',
			isFavorite: project.isFavorite ?? false,
			createdAt: now,
			updatedAt: now
		}
		existing.push(newProject)
		win.localStorage.setItem(storageKey, JSON.stringify(existing))
	})
})

// Comando para limpar projetos guest
Cypress.Commands.add('clearGuestProjects', () => {
	cy.window().then((win) => {
		win.localStorage.removeItem('cls_pm_guest_projects')
	})
})

// Comando para mock de API
Cypress.Commands.add('mockApi', (method: string, url: string, response: object, statusCode = 200) => {
	cy.intercept(method, url, {
		statusCode,
		body: response
	})
})

// Comando para aguardar app pronto
Cypress.Commands.add('waitForAppReady', () => {
	cy.get('body').should('be.visible')
	// Aguarda skeleton desaparecer ou toolbar aparecer
	cy.get('[class*="skeleton"], [data-testid="toolbar"]', { timeout: 15000 })
		.should('exist')
})

export {}
