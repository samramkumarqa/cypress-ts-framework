import path from 'path';

describe('Files', () => {
  it('uploads a file with cy.selectFile (no plugin needed)', () => {
    cy.visit('/upload');
    cy.get('#file-upload').selectFile('cypress/fixtures/uploads/sample-a.txt');
    cy.get('#file-submit').click();
    cy.contains('h3', 'File Uploaded!').should('be.visible');
    cy.get('#uploaded-files').should('have.text', 'sample-a.txt');
  });

  it('uploads by drag and drop onto the drop zone', () => {
    cy.visit('/upload');
    cy.get('#drag-drop-upload').selectFile('cypress/fixtures/uploads/sample-b.txt', { action: 'drag-drop' });
    cy.get('#drag-drop-upload').should('contain.text', 'sample-b.txt');
  });

  it('downloads a file and checks it on disk', () => {
    cy.visit('/download');
    cy.get('#content a')
      .first()
      .then(($link) => {
        const fileName = $link.text().trim();
        cy.wrap($link).click();
        cy.readFile(path.join(Cypress.config('downloadsFolder'), fileName), { timeout: 15_000 }).should('exist');
      });
  });
});
