import { CoreConstants } from '@mlchat-poc/frontend-tools';
// import {
//   Brand,
//   Campaign,
//   getBrandMock,
//   getCampaignMock
// } from '@campaign-test/models';
import {
  WebSocketMessage,
  getWebSocketMessageMock,
  TodoModel,
  getTodoMock
} from '@mlchat-poc/models';
import { getTodos } from '../../support/app.po';


describe('Chat page - Message list', () => {
  const chatUrl = CoreConstants.routePath.root;
  // const chatApiUrl = `${Cypress.env('backApi').baseUrlMessage}`; // API endpoint (if we use real API)
  // const toDoApiUrl = `${Cypress.env('backApi').baseUrlTodo}`; // API endpoint (if we use real API)
  // const chatApiUrlMock = '/assets/json-mocks/messages.json'; // Static JSON Mock (if we don't use real API)
  const chatApiUrlMock = '/assets/json-mocks/todos.json'; // Static JSON Mock (if we don't use real API)

  // Fake messages
  const mockedMessages: WebSocketMessage[] = [
    getWebSocketMessageMock()
  ];
  // Fake todos
  const mockedTodos: TodoModel[] = [
    getTodoMock()
  ];

  it('Display messages / todos', () => {
    cy.server();
    cy.route(chatApiUrlMock, mockedTodos).as('getTodos');
    cy.visit(chatUrl);

    getTodos().should(t => {
      expect(t.length).equal(mockedMessages.length);
    });

    getTodos().each(($el, index, $list) => {
      const text = $el.text();

      expect(text).equal(mockedTodos[index].title);
    });
  });
});
