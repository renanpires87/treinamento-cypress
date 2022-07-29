///<reference types="cypress" />

describe('Cadastro / Sign Up', () => {

   // it.only('acessando config',()  => {
   //    cy.log(Cypress.env("usuario"));
      
   // }); 
   let time;
   beforeEach(() => {
      // ARRANGE
      time = new Date().getTime();
      cy.visit("register");
   });

   it('cadastro com sucesso',()  => {

      // ACT
      cy.get("[ng-model$=username]").type(`test-amendoin${time}`);
      cy.get("[ng-model$=mail]").type(`test-amendoin${time}@mail.com`);
      cy.get("[ng-model$=password]").type("123456");
      cy.get("button[type=submit]").click();

      // ASSERT
      cy.contains('Your Feed').should("be.visible")
   }); 

   it('usuario não pode ser em branco',()  => {
      
      // ACT
      cy.get("[ng-model$=mail]").type(`test-amendoin${time}@mail.com`);
      cy.get("[ng-model$=password]").type("123456");
      cy.get("button[type=submit]").click();

      // ASSERT
      cy.contains("username can't be blank").should("be.visible")
      cy.get("[ng-model$=username]").should("be.empty")
   }); 

   it('email não pode ser em branco',()  => {
      

      // ACT
      cy.get("[ng-model$=username]").type(`test-amendoin${time}`);
      cy.get("[ng-model$=password]").type("123456");
      cy.get("button[type=submit]").click();

      // ASSERT
      cy.contains("email can't be blank").should("be.visible")
      cy.get("[ng-model$=email]").should("be.empty")
   }); 

   it('senha não pode ser em branco',()  => {
      
      // ACT
      cy.get("[ng-model$=username]").type(`test-amendoin${time}`);
      cy.get("[ng-model$=mail]").type(`test-amendoin${time}@mail.com`);
      cy.get("button[type=submit]").click();

      // ASSERT
      cy.contains("password can't be blank").should("be.visible")
      cy.get("[ng-model$=password]").should("be.empty")
   });

   it('cadastro com sucesso (rotas)', () => {
      // intercept
         // route matcher - toda a config pra encontrar uma requisicao
         // route handler - toda a config para manipular o resultado
      cy.intercept({
         method: 'POST',
         pathname: '/api/users',
         hostname: 'api.realworld.io'
      }, {
         statusCode: 500,
         body: {
            "errors": {"server" : ["servidor está fora do ar!"]}
         }
      }).as("postCreateUserSimulado");

      // ACT
      cy.get("[ng-model$=username]").type(`test-amendoin${time}`);
      cy.get("[ng-model$=mail]").type(`test-amendoin${time}@mail.com`);
      cy.get("[ng-model$=password]").type("123456");
      cy.get("button[type=submit]").click();

      // ASSERT
      cy.contains("servidor está fora do ar!").should("be.visible")
      
   });

   it('cadastro com sucesso (rotas)', () => {
      
      cy.intercept({
         method: 'POST',
         pathname: '/api/users',
         hostname: 'api.realworld.io'
      }).as("postCreateUser");

      // ACT
      cy.get("[ng-model$=username]").type(`test-amendoin${time}`);
      cy.get("[ng-model$=mail]").type(`test-amendoin${time}@mail.com`);
      cy.get("[ng-model$=password]").type("123456");
      cy.get("button[type=submit]").click();

      cy.wait("@postCreateUser").then(interception => {
         cy.log(`Status code ${interception.response.statusCode}`);
         // should / expect
         expect(interception.response.statusCode).to.be.eq(200);
      });

      // ASSERT
      cy.contains('Your Feed').should("be.visible")
   });

});