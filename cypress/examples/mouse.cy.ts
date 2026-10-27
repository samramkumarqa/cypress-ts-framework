describe('Mouse actions', () => {
  it('right click opens a context-menu alert', () => {
    cy.visit('/context_menu');
    const alert = cy.stub().as('alert');
    cy.on('window:alert', alert);
    cy.get('#hot-spot').rightclick();
    cy.get('@alert').should('have.been.calledWith', 'You selected a context menu');
  });

  it('HTML5 drag and drop with a shared DataTransfer', () => {
    cy.visit('/drag_and_drop');
    const dataTransfer = new DataTransfer();
    cy.get('#column-a').trigger('dragstart', { dataTransfer });
    cy.get('#column-b').trigger('drop', { dataTransfer });
    cy.get('#column-a').trigger('dragend', { dataTransfer });
    cy.get('#column-a header').should('have.text', 'B');
    cy.get('#column-b header').should('have.text', 'A');
  });

  it('scrolls an element into view', () => {
    cy.visit('/large');
    cy.get('#sibling-50\\.3').scrollIntoView();
    cy.get('#sibling-50\\.3').should('be.visible');
  });
});
