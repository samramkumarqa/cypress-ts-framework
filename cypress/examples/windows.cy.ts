/**
 * Cypress drives a single tab. Two standard ways to test links that open a new one:
 * remove target="_blank" so it opens in place, or assert on the href without clicking.
 */
describe('New tabs', () => {
  beforeEach(() => cy.visit('/windows'));

  it('opens the link in the same tab', () => {
    cy.contains('a', 'Click Here').should('have.attr', 'target', '_blank').invoke('removeAttr', 'target').click();
    cy.location('pathname').should('eq', '/windows/new');
    cy.get('h3').should('have.text', 'New Window');
  });

  it('verifies where the link goes without opening it', () => {
    cy.contains('a', 'Click Here').should('have.attr', 'href', '/windows/new');
  });
});
