/**
 * Testes E2E - CRUD de Projetos
 *
 * Cenários cobertos:
 * - Listagem de projetos
 * - Criação de novo projeto
 * - Edição de projeto existente
 * - Exclusão de projeto
 * - Favoritar/desfavoritar projeto
 *
 * Estratégia:
 * - Usa modo guest para testes isolados (localStorage)
 * - Valida mudanças de estado refletidas na UI
 * - Testes independentes com estado limpo
 */

describe('CRUD de Projetos', () => {
	beforeEach(() => {
		cy.clearCookies()
		cy.clearLocalStorage()
	})

	describe('Listagem de Projetos', () => {
		it('deve exibir empty state quando não há projetos', () => {
			// Objetivo: Validar UI quando lista está vazia
			cy.loginAsGuest()

			// Empty state deve estar visível
			cy.getByTestId('empty-content').should('be.visible')
			cy.contains('Nenhum projeto').should('be.visible')
			cy.getByTestId('empty-content-button').should('exist')
		})

		it('deve exibir lista de projetos quando existem projetos', () => {
			// Objetivo: Validar renderização da lista
			cy.loginAsGuest()

			// Criar projetos via localStorage
			cy.createProject({
				name: 'Projeto Alpha',
				client: 'Cliente A',
				startDate: '2025-01-01',
				endDate: '2025-06-30'
			})
			cy.createProject({
				name: 'Projeto Beta',
				client: 'Cliente B',
				startDate: '2025-02-01',
				endDate: '2025-07-31'
			})

			// Recarrega para ver os projetos
			cy.reload()
			cy.getByTestId('logout-button', { timeout: 15000 }).should('be.visible')
			cy.get('[data-testid="projects-list"], [data-testid="projects-empty-state"]', {
				timeout: 20000
			}).should('exist')

			// Projetos devem estar na lista
			cy.getByTestId('project-card').should('have.length', 2)
			cy.contains('Projeto Alpha').should('be.visible')
			cy.contains('Projeto Beta').should('be.visible')
		})

		it('deve exibir contador correto de projetos', () => {
			// Objetivo: Validar contador no toolbar
			cy.loginAsGuest()

			cy.createProject({
				name: 'Projeto 1',
				client: 'Cliente',
				startDate: '2025-01-01',
				endDate: '2025-12-31'
			})
			cy.createProject({
				name: 'Projeto 2',
				client: 'Cliente',
				startDate: '2025-01-01',
				endDate: '2025-12-31'
			})
			cy.createProject({
				name: 'Projeto 3',
				client: 'Cliente',
				startDate: '2025-01-01',
				endDate: '2025-12-31'
			})

			cy.reload()
			cy.getByTestId('logout-button', { timeout: 15000 }).should('be.visible')
			cy.get('[data-testid="projects-list"], [data-testid="projects-empty-state"]', {
				timeout: 20000
			}).should('exist')

			// Contador deve mostrar 3
			cy.getByTestId('toolbar').contains('(3)').should('be.visible')
		})
	})

	describe('Criação de Projeto', () => {
		beforeEach(() => {
			cy.loginAsGuest()
		})

		it('deve navegar para página de criação ao clicar em Novo Projeto', () => {
			// Objetivo: Validar navegação
			cy.getByTestId('empty-content-button').click()

			cy.url().should('include', '/project/new')
			cy.getByTestId('project-form').should('be.visible')
		})

	})
		

	describe('Edição de Projeto', () => {
		beforeEach(() => {
			cy.loginAsGuest()

			// Criar projeto para editar
			cy.createProject({
				name: 'Projeto Original',
				client: 'Cliente Original',
				startDate: '2025-01-01',
				endDate: '2025-12-31'
			})

			cy.reload()
			cy.getByTestId('logout-button', { timeout: 15000 }).should('be.visible')
			cy.get('[data-testid="projects-list"], [data-testid="projects-empty-state"]', {
				timeout: 20000
			}).should('exist')
		})

		it('deve navegar para página de edição ao clicar em Editar', () => {
			// Objetivo: Validar navegação para edição
			cy.getByTestId('project-card').first().within(() => {
				cy.getByTestId('project-actions-button').click()
			})
			cy.contains('Editar').click()

			cy.url().should('include', '/project/')
			cy.getByTestId('project-form').should('be.visible')
		})

		it('deve carregar dados do projeto no formulário de edição', () => {
			// Objetivo: Validar preenchimento do formulário
			cy.getByTestId('project-card').first().within(() => {
				cy.getByTestId('project-actions-button').click()
			})
			cy.contains('Editar').click()

			// Campos devem estar preenchidos
			cy.getByTestId('project-form').within(() => {
				cy.get('[data-testid="project-name-input"]')
					.should('have.value', 'Projeto Original')
				cy.get('[data-testid="project-client-input"]')
					.should('have.value', 'Cliente Original')
			})
		})
	})

	describe('Exclusão de Projeto', () => {
		beforeEach(() => {
			cy.loginAsGuest()

			cy.createProject({
				name: 'Projeto para Excluir',
				client: 'Cliente',
				startDate: '2025-01-01',
				endDate: '2025-12-31'
			})

			cy.reload()
			cy.getByTestId('logout-button', { timeout: 15000 }).should('be.visible')
			cy.get('[data-testid="projects-list"], [data-testid="projects-empty-state"]', {
				timeout: 20000
			}).should('exist')
		})

		it('deve exibir modal de confirmação ao clicar em Remover', () => {
			// Objetivo: Validar exibição do modal
			cy.getByTestId('project-card').first().within(() => {
				cy.getByTestId('project-actions-button').click()
			})
			cy.contains('Remover').click()

			// Modal deve aparecer
			cy.getByTestId('confirmation-dialog').should('be.visible')
			cy.contains('Remover projeto').should('be.visible')
			cy.contains('Projeto para Excluir').should('be.visible')
		})

		it('deve fechar modal ao clicar em Cancelar', () => {
			// Objetivo: Validar cancelamento
			cy.getByTestId('project-card').first().within(() => {
				cy.getByTestId('project-actions-button').click()
			})
			cy.contains('Remover').click()
			cy.getByTestId('confirmation-cancel-button').click()

			// Modal deve fechar
			cy.getByTestId('confirmation-dialog').should('not.exist')

			// Projeto deve continuar na lista
			cy.contains('Projeto para Excluir').should('be.visible')
		})

		it('deve excluir projeto ao confirmar', () => {
			// Objetivo: Validar exclusão
			cy.getByTestId('project-card').first().within(() => {
				cy.getByTestId('project-actions-button').click()
			})
			cy.contains('Remover').click()
			cy.getByTestId('confirmation-confirm-button').click()

			// Modal deve fechar
			cy.getByTestId('confirmation-dialog').should('not.exist')

			// Projeto não deve mais existir
			cy.contains('Projeto para Excluir').should('not.exist')

			// Empty state deve aparecer
			cy.getByTestId('empty-content').should('be.visible')
		})
	})

	describe('Favoritar Projeto', () => {
		beforeEach(() => {
			cy.loginAsGuest()

			cy.createProject({
				name: 'Projeto Favorito',
				client: 'Cliente',
				startDate: '2025-01-01',
				endDate: '2025-12-31',
				isFavorite: false
			})

			cy.reload()
			cy.getByTestId('logout-button', { timeout: 15000 }).should('be.visible')
			cy.get('[data-testid="projects-list"], [data-testid="projects-empty-state"]', {
				timeout: 20000
			}).should('exist')
		})

		it('deve favoritar projeto ao clicar no ícone de estrela', () => {
			// Objetivo: Validar toggle de favorito
			cy.getByTestId('project-card').first().within(() => {
				cy.getByTestId('project-favorite-button').click()
			})

			// Ícone deve mudar para favoritado
			cy.getByTestId('project-card').first().within(() => {
				cy.getByTestId('project-favorite-button')
					.should('have.attr', 'data-favorited', 'true')
			})
		})

		it('deve desfavoritar projeto ao clicar novamente', () => {
			// Objetivo: Validar toggle reverso
			// Primeiro favorita
			cy.getByTestId('project-card').first().within(() => {
				cy.getByTestId('project-favorite-button').click()
			})

			// Depois desfavorita
			cy.getByTestId('project-card').first().within(() => {
				cy.getByTestId('project-favorite-button').click()
			})

			// Ícone deve voltar ao estado normal
			cy.getByTestId('project-card').first().within(() => {
				cy.getByTestId('project-favorite-button')
					.should('have.attr', 'data-favorited', 'false')
			})
		})
	})
})
