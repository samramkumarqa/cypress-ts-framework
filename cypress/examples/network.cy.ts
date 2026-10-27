describe('Async content and HTTP', () => {
  it('waits for content to appear instead of sleeping', () => {
    // Cypress retries the assertion until it passes or times out, so no cy.wait(5000) is needed.
    cy.visit('/dynamic_loading/2');
    cy.contains('button', 'Start').click();
    cy.get('#finish', { timeout: 15_000 }).should('have.text', 'Hello World!');
  });

  it('checks status codes with cy.request', () => {
    [200, 301, 404, 500].forEach((code) => {
      cy.request({ url: `/status_codes/${code}`, followRedirect: false, failOnStatusCode: false })
        .its('status')
        .should('eq', code);
    });
  });
});
