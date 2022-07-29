///<reference types="cypress" />

describe('Settings / Configuracao', () => {
    it('efetuar logout da aplicacao', () => {
        cy.login();
        cy.visit("/");
        cy.contains('a','Settings').click();

        cy.contains('button','Or click here to logout').click();

        // ASSERT
        cy.contains('Sign in').should("be.visible")
        cy.contains('Sign up').should("be.visible")
    });
});