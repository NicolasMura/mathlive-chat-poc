import { Campaign } from '@mlchat-poc/models';

describe('Campaigns API', () => {
  // const campaignsListApiUrl = `${Cypress.env('backApi').baseUrlCampaign}`; // API endpoint (if we use real API)
  const campaignsListApiUrlMock = '/assets/json-mocks/payload-rmp.json'; // Static JSON Mock (if we don't use real API)

  it('returns JSON', () => {
    cy.request(campaignsListApiUrlMock)
      .its('headers')
      .its('content-type')
      .should('include', 'application/json');
  });

  it.only('get all campaigns', () => {
    cy.request({
      method: 'GET',
      url: campaignsListApiUrlMock
    })
      .its('body')
      .then((body: { totalVolume: number, requests: Campaign[]}) => {
        expect(body.totalVolume).to.equal(9);
      });
  });
});
