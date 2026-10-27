import { oxd } from '../support/selectors';

export class LoginPage {
  visit() {
    cy.visit('/auth/login');
    cy.get('input[name="username"]').should('be.visible');
    return this;
  }

  username() {
    return cy.get('input[name="username"]');
  }

  password() {
    return cy.get('input[name="password"]');
  }

  submit(username: string, password: string) {
    if (username) this.username().type(username);
    if (password) this.password().type(password, { log: false });
    cy.get('button[type="submit"]').click();
    return this;
  }

  /** The red banner shown for rejected credentials. */
  alert() {
    return cy.get(oxd.alertText);
  }

  /** "Required" messages under empty fields. */
  fieldErrors() {
    return cy.get(oxd.fieldError);
  }
}
