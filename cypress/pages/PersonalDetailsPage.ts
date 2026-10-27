export class PersonalDetailsPage {
  visit(empNumber: number) {
    cy.visit(`/pim/viewPersonalDetails/empNumber/${empNumber}`);
    return this.waitUntilLoaded(empNumber);
  }

  waitUntilLoaded(empNumber: number) {
    cy.location('pathname').should('include', `/pim/viewPersonalDetails/empNumber/${empNumber}`);
    // The form's name field is filled once the employee data has loaded.
    cy.get('input[name="firstName"]').should('not.have.value', '');
    return this;
  }

  /** The name shown above the profile picture. */
  headerName() {
    return cy.get('.orangehrm-edit-employee-name h6');
  }

  firstName() {
    return cy.get('input[name="firstName"]');
  }

  lastName() {
    return cy.get('input[name="lastName"]');
  }

  employeeId() {
    return cy.field(/^Employee Id$/i);
  }
}
