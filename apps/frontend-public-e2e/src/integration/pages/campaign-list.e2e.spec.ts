import { CoreConstants } from '@mlchat-poc/frontend-tools';
import {
  Brand,
  Campaign,
  getBrandMock,
  getCampaignMock
} from '@mlchat-poc/models';
import { getCampaignsRows, getCampaignsNames } from '../../support/app.po';

describe('Campaigns list', () => {
  const campaignsListUrl = CoreConstants.routePath.campaigns.root;
  // const campaignsListApiUrl = `${Cypress.env('backApi').baseUrlCampaign}`; // API endpoint (if we use real API)
  const campaignsListApiUrlMock = '/assets/json-mocks/payload-rmp.json'; // Static JSON Mock (if we don't use real API)

  // Fake brands / campaigns
  const mockedBrands: Brand[] = [
    getBrandMock({ brandId: 1, name: 'Fake Brand 1' }),
    getBrandMock({ brandId: 2, name: 'Fake Brand 2' }),
    getBrandMock({ brandId: 3, name: 'Fake Brand 3' })
  ];
  const mockedCampaigns: { totalVolume: number; requests: Campaign[] } = {
    totalVolume: 4,
    requests: [
      getCampaignMock({
        campaignName: 'Fake Campaign 1',
        brand: mockedBrands[0]
      }),
      getCampaignMock({
        campaignName: 'Fake Campaign 1 bis',
        brand: mockedBrands[1]
      }),
      getCampaignMock({
        campaignName: 'Fake Campaign 2',
        brand: mockedBrands[2]
      }),
      getCampaignMock({
        campaignName: 'Fake Campaign 3',
        brand: mockedBrands[2]
      })
    ]
  };

  it('Display campaigns', () => {
    cy.server();
    cy.route(campaignsListApiUrlMock, mockedCampaigns).as('getCampaigns');
    cy.visit(campaignsListUrl);

    getCampaignsRows().should(t => {
      expect(t.length).equal(mockedCampaigns.requests.length);
    });

    getCampaignsNames().each(($e1, index, $list) => {
      const text = $e1.text();
      expect(text).equal(mockedCampaigns.requests[index].campaignName);
    });
  });

  it('Filter campaigns by free search and brand name', () => {
    cy.get('[data-cy=search-input]')
      .type('Fake Campaign 1')
      .should('have.value', 'Fake Campaign 1');

    getCampaignsRows().should(t => {
      expect(t.length).equal(2);
    });

    cy.get('[data-cy=brand-select-btn]')
      .click()
      .get('[id=mat-option-1]')
      .click();

    getCampaignsRows().should(t => {
      expect(t.length).equal(1);
    });
  });
});
