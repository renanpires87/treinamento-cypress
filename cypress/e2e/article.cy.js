///<reference types="cypress" />

describe('Articles / Artigos', () => {

    it('criar um novo artigo com sucesso', () => {
        const title = `Titulo do dia ${Date.now()}`
        cy.login();
        cy.visit("/");
        cy.contains('a','New Article').click();

        cy.intercept({
            method: 'POST',
            pathname: '/api/articles',
            hostname: 'api.realworld.io'
         }).as("postArticle");

        cy.get("[ng-model$=title]").type(title);
        cy.get("[ng-model$=description]").type("Descricao do artigo");
        cy.get("[ng-model$=body]").type("Conteudo do artigo");

        cy.contains("button", "Publish Article").click();

        // ASSERT
        cy.wait("@postArticle").then(interception => {
            expect(interception.response.statusCode).to.be.eq(200);
         });

    });

    it('titulo nao pode ser branco', () => {
        cy.login();
        cy.visit("/");
        cy.contains('a','New Article').click();

        cy.get("[ng-model$=description]").type("Descricao do artigo");
        cy.get("[ng-model$=body]").type("Conteudo do artigo");

        cy.contains("button", "Publish Article").click();

        // ASSERT
        cy.contains("title can't be blank").should("be.visible")

    });

    it('descricao nao pode ser branco', () => {
        cy.login();
        cy.visit("/");
        cy.contains('a','New Article').click();

        cy.get("[ng-model$=title]").type("Title");
        cy.get("[ng-model$=body]").type("Conteudo do artigo");

        cy.contains("button", "Publish Article").click();

        // ASSERT
        cy.contains("description can't be blank").should("be.visible")

    });

    it('conteudo nao pode ser branco', () => {
        cy.login();
        cy.visit("/");
        cy.contains('a','New Article').click();

        cy.get("[ng-model$=title]").type("Title");
        cy.get("[ng-model$=description]").type("Descricao do artigo");

        cy.contains("button", "Publish Article").click();

        // ASSERT
        cy.contains("body can't be blank").should("be.visible")

    });

    it('tentar criar artigo quando servidor esta fora', () => {

        cy.intercept({
            method: 'POST',
            pathname: '/api/articles',
            hostname: 'api.realworld.io'
         }, {
            statusCode: 500,
            body: {
               "errors": {"server" : ["servidor está fora do ar!"]}
            }
         }).as("postArticleSimulado");

        // ACT
        cy.get("[ng-model$=title]").type("Title");
        cy.get("[ng-model$=description]").type("Descricao do artigo");
        cy.get("[ng-model$=body]").type("Conteudo do artigo");

        cy.contains("button", "Publish Article").click();

        // ASSERT
      cy.contains("servidor está fora do ar!").should("be.visible")
    });
    
});