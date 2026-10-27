import { LoginPage, SideMenu } from '../../pages';

describe('Login', { tags: '@auth' }, () => {
  const login = new LoginPage();

  beforeEach(() => {
    login.visit();
  });

  it('admin can log in and log out', { tags: '@smoke' }, () => {
    cy.env(['adminPassword']).then(({ adminPassword }) => {
      cy.intercept('POST', '**/auth/validate').as('login');
      login.submit(Cypress.expose('adminUsername'), adminPassword);

      // The form posts to /auth/validate, which redirects to the dashboard on success.
      cy.wait('@login')
        .its('response.headers.location')
        .should('match', /dashboard\/index/);
      cy.location('pathname').should('include', '/dashboard/index');
      new SideMenu().moduleTitle().should('have.text', 'Dashboard');

      new SideMenu().logout();
      cy.location('pathname').should('include', '/auth/login');
    });
  });

  it('rejects a wrong password', () => {
    login.submit(Cypress.expose('adminUsername'), 'not-the-password');
    login.alert().should('have.text', 'Invalid credentials');
    cy.location('pathname').should('include', '/auth/login');
  });

  it('rejects an unknown user', () => {
    login.submit(`nobody_${Date.now()}`, 'whatever123');
    login.alert().should('have.text', 'Invalid credentials');
  });

  it('requires both fields', () => {
    login.submit('', '');
    login
      .fieldErrors()
      .should('have.length', 2)
      .each(($el) => {
        expect($el.text().trim()).to.eq('Required');
      });
  });

  it('redirects to login when opening a protected page signed out', () => {
    cy.visit('/pim/viewEmployeeList');
    cy.location('pathname').should('include', '/auth/login');
  });
});
