import { getAddTodoButton, getTodos } from "../support/app.po";

describe('frontend-public', () => {
  const rootUrl = `${Cypress.env('baseUrl')}/${Cypress.env('routes').root}`;

  beforeEach(() => cy.visit(rootUrl));

  it('Displays welcome message', () => {
    // @TODO
  });

  it('should display todos', () => {
    getTodos().should((t) => expect(t.length).equal(2));
    getAddTodoButton().click();
    getTodos().should((t) => expect(t.length).equal(3));
  });
});
