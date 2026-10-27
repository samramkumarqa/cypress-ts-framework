import { EmployeeListPage } from '../../pages';

/**
 * UI states that are hard to reach on a shared demo, produced by stubbing the API with cy.intercept.
 * These run against the real front end but don't depend on the demo's data.
 */
describe('PIM: employee list with stubbed API', { tags: ['@pim', '@stubbed'] }, () => {
  const LIST = { method: 'GET', pathname: '**/api/v2/pim/employees' } as const;

  beforeEach(() => {
    cy.loginAsAdmin();
  });

  it('renders the rows the API returns', () => {
    cy.intercept(LIST, { fixture: 'employees-page.json' }).as('list');
    cy.visit('/pim/viewEmployeeList');
    cy.wait('@list');

    const list = new EmployeeListPage();
    list.recordCount().should('have.text', '(2) Records Found');
    list.rows().should('have.length', 2);
    list.row('STUB001').should('contain.text', 'Ada').and('contain.text', 'Lovelace');
    list.row('STUB002').should('contain.text', 'Alan').and('contain.text', 'Turing');
  });

  it('shows the empty state when there are no employees', () => {
    cy.intercept(LIST, { body: { data: [], meta: { total: 0 }, rels: [] } }).as('list');
    cy.visit('/pim/viewEmployeeList');
    cy.wait('@list');

    new EmployeeListPage().recordCount().should('have.text', 'No Records Found');
    cy.get('.oxd-table-body .oxd-table-card').should('not.exist');
  });

  it('sends the Employee Id filter to the API', () => {
    cy.intercept(LIST, { body: { data: [], meta: { total: 0 }, rels: [] } }).as('list');
    cy.visit('/pim/viewEmployeeList');
    cy.wait('@list');

    cy.field(/^Employee Id$/i).type('ABC123');
    cy.contains('button[type="submit"]', 'Search').click();

    cy.wait('@list').its('request.url').should('include', 'employeeId=ABC123');
  });
});
