/**
 * Arquivo de suporte do Cypress E2E
 * Carrega comandos customizados e configurações globais
 */

import './commands'

// Desabilita logs de exceções não capturadas que podem vir do app
Cypress.on('uncaught:exception', (err, runnable) => {
	// Retorna false para prevenir que o Cypress falhe o teste
	// em exceções não relacionadas ao teste
	if (err.message.includes('ResizeObserver')) {
		return false
	}
	return true
})

// Hook global antes de cada teste
beforeEach(() => {
	// Limpa cookies e localStorage para garantir estado limpo
	cy.clearCookies()
	cy.clearLocalStorage()
})
