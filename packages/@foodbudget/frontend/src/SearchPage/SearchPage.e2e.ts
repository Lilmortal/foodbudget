/// <reference types="cypress" />
/// <reference types="cypress-plugin-snapshots" />

it('should redirect you to meal page with the correct query', () => {
  cy.visit('http://localhost:3000');

  cy.get('input#budget').type('4');

  cy.get('input#ingredients').type('test{enter}');

  cy.get('button[type="submit"]').click();

  cy.get('body').toMatchImageSnapshot();
});
