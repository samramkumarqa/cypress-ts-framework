describe('Form controls', () => {
  it('checkboxes', () => {
    cy.visit('/checkboxes');
    cy.get('#checkboxes input[type="checkbox"]').as('boxes').should('have.length', 2);
    cy.get('@boxes').check();
    cy.get('@boxes').each(($box) => expect($box).to.be.checked);
    cy.get('@boxes').first().uncheck();
    cy.get('@boxes').first().should('not.be.checked');
  });

  it('select dropdown', () => {
    cy.visit('/dropdown');
    cy.get('#dropdown').select('Option 2');
    cy.get('#dropdown').should('have.value', '2');
    cy.get('#dropdown option:selected').should('have.text', 'Option 2');
  });

  it('keyboard input', () => {
    cy.visit('/key_presses');
    cy.get('#target').type('{shift}');
    cy.get('#result').should('have.text', 'You entered: SHIFT');
  });

  it('form login with session-style success check', () => {
    // The practice site prints these demo credentials on the page.
    cy.visit('/login');
    cy.get('#username').type('tomsmith');
    cy.get('#password').type('SuperSecretPassword!', { log: false });
    cy.get('button[type="submit"]').click();
    cy.get('#flash').should('contain.text', 'You logged into a secure area!');
    cy.location('pathname').should('eq', '/secure');
  });
});
