///<reference types="cypress" />

describe('Login / Sign In', () => {
    let time;
    let user;
    let senha;
    let email;

    before(() => {
      time = new Date().getTime();
      senha = "123456";
      user = `test-amendoin${time}`
      email = `${user}@mail.com`

      cy.intercept({
        method: 'POST',
        pathname: '/api/users',
        hostname: 'api.realworld.io'
     }).as("postCreateUser");


      cy.visit("register");
      // ACT
      cy.get("[ng-model$=username]").type(user);
      cy.get("[ng-model$=mail]").type(email);
      cy.get("[ng-model$=password]").type(senha);
      cy.get("button[type=submit]").click();

      cy.wait("@postCreateUser").then(interception => {
        cy.visit('settings');
        cy.get('.btn-outline-danger').click();
      });
    });
    
    beforeEach(() => {
        // ARRANGE
        cy.visit("login");
     });

    it('email nao pode ser branco', () => {

        // ACT
        cy.get("[ng-model$=password]").type(senha);
        cy.get("button[type=submit]").click();

        // ASSERT
        cy.contains("email can't be blank").should("be.visible")
    });

    it('senha nao pode ser branco', () => {

        // ACT
        cy.get("[ng-model$=email]").type(email);
        cy.get("button[type=submit]").click();

        // ASSERT
        cy.contains("password can't be blank").should("be.visible")
    });

    it('senha nao pode ser incorreta', () => {

        // ACT
        cy.get("[ng-model$=email]").type(email);
        cy.get("[ng-model$=password]").type(`${senha}789`);
        cy.get("button[type=submit]").click();

        // ASSERT
        cy.contains("email or password is invalid").should("be.visible")
    });

    it('usuario sem cadastro', () => {

        // ACT
        cy.get("[ng-model$=email]").type(`123${email}`);
        cy.get("[ng-model$=password]").type(senha);
        cy.get("button[type=submit]").click();

        // ASSERT
        cy.contains("email or password is invalid").should("be.visible")
    });

    it('acessar opcao preciso de uma nova conta', () => {

        // ACT
        cy.contains('a','Need an account?').click();

        // ASSERT
        cy.url().should('be.equal', 'https://demo.realworld.io/#/register')
        cy.url().should('contains','register')
    });

    it('tentar autenticar quando servidor esta fora', () => {

        cy.intercept({
            method: 'POST',
            pathname: '/api/users/login',
            hostname: 'api.realworld.io'
         }, {
            statusCode: 500,
            body: {
               "errors": {"server" : ["servidor está fora do ar!"]}
            }
         }).as("postAutenticarUserSimulado");

        // ACT
        cy.get("[ng-model$=email]").type(email);
        cy.get("[ng-model$=password]").type(senha);
        cy.get("button[type=submit]").click();

        // ASSERT
      cy.contains("servidor está fora do ar!").should("be.visible")
    });

    it('efetuar login com sucesso', () => {
        cy.intercept({
            method: 'POST',
            pathname: '/api/users/login',
            hostname: 'api.realworld.io'
         }).as("postAutenticarUser");
        
        // ACT
        cy.get("[ng-model$=email]").type(email);
        cy.get("[ng-model$=password]").type(senha);
        cy.get("button[type=submit]").click();

        cy.wait("@postAutenticarUser").then(interception => {
            cy.log(`Status code ${interception.response.statusCode}`);
            expect(interception.response.statusCode).to.be.eq(200);
         });

        // ASSERT
        cy.contains('Your Feed').should("be.visible")
        cy.contains('Global Feed').should("be.visible")
    });

});