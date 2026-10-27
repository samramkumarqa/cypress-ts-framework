import type { NewEmployee } from '../data/employees';

export class AddEmployeePage {
  visit() {
    cy.visit('/pim/addEmployee');
    cy.get('input[name="firstName"]').should('be.visible');
    return this;
  }

  /** Fills the form and saves. Yields the new employee's empNumber from the API response. */
  create(employee: NewEmployee) {
    cy.intercept('POST', '**/api/v2/pim/employees').as('createEmployee');

    cy.get('input[name="firstName"]').type(employee.firstName);
    cy.get('input[name="middleName"]').type(employee.middleName);
    cy.get('input[name="lastName"]').type(employee.lastName);
    // The form pre-fills a generated id; replace it with ours so the test can find the record.
    cy.field(/^Employee Id$/i).clear();
    cy.field(/^Employee Id$/i).type(employee.employeeId);
    cy.get('button[type="submit"]').click();

    return cy.wait('@createEmployee').then(({ response }) => {
      expect(response?.statusCode, 'create employee status').to.eq(200);
      return response!.body.data.empNumber as number;
    });
  }

  submitEmpty() {
    cy.get('input[name="firstName"]').clear();
    cy.get('input[name="lastName"]').clear();
    cy.get('button[type="submit"]').click();
    return this;
  }
}
