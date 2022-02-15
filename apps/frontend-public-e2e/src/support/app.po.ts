export const getPageTitle = () => cy.get('.title');
export const getCampaignsRows = () => cy.get('[data-cy=campaigns-table] .mat-row.campaign');
export const getCampaignsNames = () => cy.get('[data-cy=campaigns-table] mat-cell:nth-child(2)');
export const getCampaignsSearchBtn = () => cy.get('[data-cy=campaigns-table] mat-cell:nth-child(2)');
