import { getPageTitle } from '../support/app.po';


describe('frontend-public', () => {
  const rootUrl = `${Cypress.env('routes').root}`;

  beforeEach(() => cy.visit(rootUrl));

  it('Displays welcome message', () => {
    getPageTitle().first().should('contain', 'All requests')
  });
});
