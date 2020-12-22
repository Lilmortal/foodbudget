/// <reference types="cypress" />
/// <reference types="cypress-plugin-snapshots" />

it('should redirect you to meal page with the correct query', () => {
  cy.visit('http://localhost:3000');

  cy.get('[data-cy=budgetInput]').type('4');

  cy.get('[data-cy=ingredientsInput]').type('test{enter}');

  cy.get('button[type="submit"]').click();

  cy.get('body').toMatchImageSnapshot();
});
