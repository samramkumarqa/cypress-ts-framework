import { SideMenu } from '../../pages';

describe('Dashboard', { tags: '@dashboard' }, () => {
  beforeEach(() => {
    cy.loginAsAdmin();
  });

  it('loads every widget API successfully', { tags: '@smoke' }, () => {
    // Each dashboard widget fetches its own data; watch them all.
    cy.intercept('GET', '**/api/v2/dashboard/shortcuts*').as('quickLaunch');
    cy.intercept('GET', '**/api/v2/dashboard/employees/action-summary*').as('actions');
    cy.intercept('GET', '**/api/v2/dashboard/employees/subunit*').as('bySubunit');
    cy.intercept('GET', '**/api/v2/dashboard/employees/locations*').as('byLocation');

    cy.visit('/dashboard/index');
    new SideMenu().moduleTitle().should('have.text', 'Dashboard');

    cy.wait(['@quickLaunch', '@actions', '@bySubunit', '@byLocation']).then((calls) => {
      calls.forEach((call) => expect(call.response?.statusCode, call.request.url).to.eq(200));
    });
  });

  it('side menu opens PIM', () => {
    cy.visit('/dashboard/index');
    const menu = new SideMenu();
    menu.open('PIM');
    cy.location('pathname').should('include', '/pim/viewEmployeeList');
    menu.moduleTitle().should('have.text', 'PIM');
  });
});
