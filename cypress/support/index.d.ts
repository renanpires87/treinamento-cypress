declare namespace Cypress {
    interface Chainable{
        /**
         * Comando customizado para efetuar login
         * @example cy.login()
         */
        login(): void
    }
}