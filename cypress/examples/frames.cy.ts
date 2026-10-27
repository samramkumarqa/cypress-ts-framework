/** Reads inside iframes without a plugin: get the frame's document body and wrap it. */
const frameBody = (selector: string) =>
  cy.get(selector).its('0.contentDocument.body').should('not.be.empty').then(cy.wrap);

describe('Frames', () => {
  it('reads text from nested frames', () => {
    cy.visit('/nested_frames');
    cy.get('frame[name="frame-top"]')
      .its('0.contentDocument')
      .then((topDoc) => {
        cy.wrap(topDoc.querySelector('frame[name="frame-left"]'))
          .its('contentDocument.body')
          .should('contain.text', 'LEFT');
        cy.wrap(topDoc.querySelector('frame[name="frame-middle"]'))
          .its('contentDocument.body')
          .find('#content')
          .should('have.text', 'MIDDLE');
      });
    frameBody('frame[name="frame-bottom"]').should('contain.text', 'BOTTOM');
  });
});
