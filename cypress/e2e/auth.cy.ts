/**
 * Testes E2E - Autenticação
 *
 * Cenários cobertos:
 * - Login como convidado (guest)
 * - Login com credenciais válidas
 * - Registro de novo usuário
 * - Logout
 *
 * Estratégia:
 * - Usa cy.intercept para mock de chamadas HTTP
 * - Valida mudanças de estado refletidas na UI
 * - Testes independentes com estado limpo
 */

describe('Autenticação', () => {
	beforeEach(() => {
		// Limpa estado antes de cada teste
		cy.clearCookies()
		cy.clearLocalStorage()

		cy.intercept('GET', '**/api/health*', {
			statusCode: 200,
			body: { status: 'ok' }
		}).as('healthRequest')
	})

	// Helper para aguardar o modal de auth carregar completamente
	const waitForAuthModal = () => {
		cy.get('body', { timeout: 10000 }).should('be.visible')
		// Aguarda o botão de guest aparecer (indica que o modal carregou)
		cy.getByTestId('auth-guest-button', { timeout: 15000 }).should('be.visible')
	}

	const getAuthModal = () => cy.getByTestId('auth-modal-content')
	const getAuthInput = (name: string) =>
		getAuthModal().find(`input[name="${name}"]`)

	describe('Modal de Autenticação', () => {
		it('deve exibir modal de autenticação ao acessar a aplicação sem estar logado', () => {
			// Objetivo: Verificar que usuários não autenticados veem o modal
			cy.visit('/')
			waitForAuthModal()

			// Campos de login devem estar presentes
			cy.getByTestId('auth-submit-button').should('be.visible')
			cy.getByTestId('auth-guest-button').should('be.visible')
		})

		it('deve alternar entre modo login e registro', () => {
			// Objetivo: Verificar navegação entre formulários
			cy.visit('/')
			waitForAuthModal()

			// Clicar para ir ao registro
			cy.getByTestId('auth-toggle-mode').should('be.visible').click()

			// Campo de nome deve aparecer (só existe no registro)
			getAuthInput('name').should('be.visible')

			// Voltar para login
			cy.getByTestId('auth-toggle-mode').click()

			// Campo de nome não deve existir
			getAuthModal().find('input[name="name"]').should('not.exist')
		})
	})

	describe('Login como Convidado', () => {
		it('deve permitir acesso como convidado e exibir lista de projetos', () => {
			// Objetivo: Validar fluxo de guest sem chamadas à API
			cy.visit('/')
			waitForAuthModal()

			// Clicar no botão de convidado
			cy.getByTestId('auth-guest-button').should('be.visible').click()

			// Modal deve fechar (botão de guest não deve mais existir)
			cy.getByTestId('auth-guest-button', { timeout: 10000 }).should('not.exist')

			// Header autenticado deve aparecer
			cy.getByTestId('logout-button', { timeout: 15000 }).should('be.visible')

			// Conteúdo principal da home deve renderizar
			cy.get('[data-testid="projects-empty-state"], [data-testid="projects-list"]', {
				timeout: 20000
			}).should('exist')
		})

		it('deve persistir sessão de convidado após reload', () => {
			// Objetivo: Verificar persistência via cookie
			cy.visit('/')
			waitForAuthModal()
			cy.getByTestId('auth-guest-button').should('be.visible').click()

			// Aguarda UI carregar
			cy.getByTestId('logout-button', { timeout: 15000 }).should('be.visible')
			cy.get('[data-testid="projects-empty-state"], [data-testid="projects-list"]', {
				timeout: 20000
			}).should('exist')

			// Recarrega página
			cy.reload()

			// Aguarda body carregar e verifica que não há modal
			cy.get('body', { timeout: 10000 }).should('be.visible')
			cy.getByTestId('logout-button', { timeout: 15000 }).should('be.visible')
			cy.get('[data-testid="projects-empty-state"], [data-testid="projects-list"]', {
				timeout: 20000
			}).should('exist')
		})
	})

	describe('Login com Credenciais', () => {
		it('deve fazer login com credenciais válidas', () => {
			// Objetivo: Validar fluxo de login com mock de API
			cy.fixture('auth').then((auth) => {
				// Mock da API de login
				cy.intercept('POST', '**/auth/login', {
					statusCode: 200,
					body: auth.loginResponse
				}).as('loginRequest')

				// Mock da API de projetos
				cy.intercept('GET', '**/projects*', {
					statusCode: 200,
					body: { total: 0, projects: [] }
				}).as('projectsRequest')

				cy.visit('/')
				waitForAuthModal()

				// Preencher formulário
				getAuthInput('email').should('be.visible').type(auth.validUser.email)
				getAuthInput('password').should('be.visible').type(auth.validUser.password)
				cy.getByTestId('auth-submit-button').should('be.visible').click()

				// Aguardar requisição
				cy.wait('@loginRequest')

				// Modal deve fechar (botão de guest não deve mais existir)
				cy.getByTestId('auth-guest-button', { timeout: 10000 }).should('not.exist')

				// UI principal deve carregar
				cy.getByTestId('logout-button', { timeout: 15000 }).should('be.visible')
				cy.get('[data-testid="projects-empty-state"], [data-testid="projects-list"]', {
					timeout: 20000
				}).should('exist')
			})
		})

		it('deve exibir erro com credenciais inválidas', () => {
			// Objetivo: Validar tratamento de erro de login
			cy.intercept('POST', '**/auth/login', {
				statusCode: 401,
				body: { message: 'Credenciais inválidas' }
			}).as('loginRequest')

			cy.visit('/')
			waitForAuthModal()

			getAuthInput('email').should('be.visible').type('invalido@teste.com')
			getAuthInput('password').should('be.visible').type('senhaerrada')
			cy.getByTestId('auth-submit-button').should('be.visible').click()

			cy.wait('@loginRequest')

			// Modal deve continuar aberto (botão de guest ainda visível)
			cy.getByTestId('auth-guest-button').should('be.visible')

			// Mensagem de erro deve aparecer
			cy.getByTestId('auth-error', { timeout: 10000 })
				.should('be.visible')
				.and('contain', 'Credenciais inválidas')
		})
	})

	describe('Registro de Usuário', () => {
		it('deve registrar novo usuário com sucesso', () => {
			// Objetivo: Validar fluxo de registro
			cy.fixture('auth').then((auth) => {
				// Mock da API de registro
				cy.intercept('POST', '**/api/users*', {
					statusCode: 201,
					body: { message: 'Usuário criado com sucesso' }
				}).as('registerRequest')

				cy.visit('/')
				waitForAuthModal()

				// Alternar para modo registro
				cy.getByTestId('auth-toggle-mode').should('be.visible').click()

				// Aguardar campo de nome aparecer
				getAuthInput('name').should('be.visible')

				// Preencher formulário
				getAuthInput('name').type(auth.registerPayload.name)
				getAuthInput('email').should('be.visible').type(auth.registerPayload.email)
				getAuthInput('password').should('be.visible').type(auth.registerPayload.password)
				cy.getByTestId('auth-submit-button').should('be.visible').click()

				cy.wait('@registerRequest')

				// Deve voltar para modo login após registro bem-sucedido
				getAuthModal().find('input[name="name"]').should('not.exist')
			})
		})

		it('deve exibir erro ao registrar email já existente', () => {
			// Objetivo: Validar tratamento de erro de registro
			cy.intercept('POST', '**/api/users*', {
				statusCode: 409,
				body: { message: 'Email já cadastrado' }
			}).as('registerRequest')

			cy.visit('/')
			waitForAuthModal()
			cy.getByTestId('auth-toggle-mode').should('be.visible').click()

			// Aguardar campo de nome aparecer
			getAuthInput('name').should('be.visible')

			getAuthInput('name').type('Teste')
			getAuthInput('email').should('be.visible').type('existente@teste.com')
			getAuthInput('password').should('be.visible').type('senha123')
			cy.getByTestId('auth-submit-button').should('be.visible').click()

			cy.wait('@registerRequest')

			// Mensagem de erro deve aparecer
			cy.getByTestId('auth-error', { timeout: 10000 })
				.should('be.visible')
				.and('contain', 'Email já cadastrado')
		})
	})

	describe('Logout', () => {
		it('deve fazer logout e exibir modal de autenticação', () => {
			// Objetivo: Validar fluxo de logout
			// Primeiro faz login como guest
			cy.visit('/')
			waitForAuthModal()
			cy.getByTestId('auth-guest-button').should('be.visible').click()

			// Verifica que está logado - aguarda UI carregar
			cy.getByTestId('logout-button', { timeout: 15000 }).should('be.visible')
			cy.get('[data-testid="projects-empty-state"], [data-testid="projects-list"]', {
				timeout: 20000
			}).should('exist')

			// Clica no botão de logout no header
			cy.getByTestId('logout-button', { timeout: 10000 }).should('be.visible').click()

			// Modal de autenticação deve reaparecer (botão de guest visível)
			cy.getByTestId('auth-guest-button', { timeout: 10000 }).should('be.visible')
		})
	})
})
