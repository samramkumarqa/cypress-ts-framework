const toNumber = (dollars: string) => Number(dollars.replace('$', ''));

describe('Tables', () => {
  beforeEach(() => cy.visit('/tables'));

  it('finds a row by cell value and reads another cell', () => {
    cy.contains('#table1 tbody tr', 'jsmith@gmail.com').find('td').eq(0).should('have.text', 'Smith');
  });

  it('sorts by the Due column', () => {
    cy.contains('#table1 th', 'Due').click();
    cy.get('#table1 tbody tr td:nth-child(4)').then(($cells) => {
      const dues = [...$cells].map((c) => toNumber(c.innerText));
      expect(dues).to.deep.equal([...dues].sort((a, b) => a - b));
    });
  });

  it('totals a column', () => {
    cy.get('#table1 tbody tr td:nth-child(4)').then(($cells) => {
      const total = [...$cells].reduce((sum, c) => sum + toNumber(c.innerText), 0);
      expect(total).to.eq(251);
    });
  });
});
