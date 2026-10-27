import { oxd, type ToastType } from './selectors';

/**
 * Logs in as the admin once per run and reuses the browser session in every test (cy.session).
 * The first call performs a real UI login; later calls restore cookies in milliseconds.
 */
Cypress.Commands.add('loginAsAdmin', () => {
  const username: string = Cypress.expose('adminUsername');
  cy.session(
    ['admin', username],
    () => {
      cy.env(['adminPassword']).then(({ adminPassword }) => {
        cy.intercept('POST', '**/auth/validate').as('login');
        cy.visit('/auth/login');
        cy.get('input[name="username"]').type(username);
        cy.get('input[name="password"]').type(adminPassword, { log: false });
        cy.get('button[type="submit"]').click();
        cy.wait('@login');
        cy.location('pathname').should('include', '/dashboard/index');
      });
    },
    {
      // A cached session is only reused if the API still accepts it.
      validate() {
        cy.request({ url: '/api/v2/pim/employees', qs: { limit: 1 }, failOnStatusCode: false })
          .its('status')
          .should('eq', 200);
      },
      cacheAcrossSpecs: true,
    },
  );
});

/** An OrangeHRM form field, found by its visible label (e.g. "Employee Id"). */
Cypress.Commands.add('field', (label: string | RegExp) => {
  return cy.contains(`${oxd.inputGroup} label`, label).closest(oxd.inputGroup).find(oxd.inputs).first();
});

/** Waits for a toast of the given type containing the message. */
Cypress.Commands.add('toast', (type: ToastType, message: string | RegExp) => {
  return cy.contains(`${oxd.toast}--${type}`, message);
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /** Log in as the admin user, cached with cy.session across tests and specs. */
      loginAsAdmin(): Chainable<void>;
      /** Get an OrangeHRM input by its label text. */
      field(label: string | RegExp): Chainable<JQuery<HTMLElement>>;
      /** Assert a toast notification of the given type is shown. */
      toast(type: ToastType, message: string | RegExp): Chainable<JQuery<HTMLElement>>;
    }
  }
}

export {};
