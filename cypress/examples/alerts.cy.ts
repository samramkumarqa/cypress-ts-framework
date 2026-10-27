describe('JavaScript dialogs', () => {
  beforeEach(() => cy.visit('/javascript_alerts'));

  it('alert: Cypress accepts it automatically and lets us check the text', () => {
    const alert = cy.stub().as('alert');
    cy.on('window:alert', alert);
    cy.contains('button', 'Click for JS Alert').click();
    cy.get('@alert').should('have.been.calledOnceWith', 'I am a JS Alert');
    cy.get('#result').should('have.text', 'You successfully clicked an alert');
  });

  it('confirm: returning false clicks Cancel', () => {
    cy.on('window:confirm', (text) => {
      expect(text).to.eq('I am a JS Confirm');
      return false;
    });
    cy.contains('button', 'Click for JS Confirm').click();
    cy.get('#result').should('have.text', 'You clicked: Cancel');
  });

  it('prompt: stub window.prompt to type an answer', () => {
    cy.window().then((win) => cy.stub(win, 'prompt').returns('Cypress'));
    cy.contains('button', 'Click for JS Prompt').click();
    cy.get('#result').should('have.text', 'You entered: Cypress');
  });
});
