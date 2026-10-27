import { oxd } from '../support/selectors';

export class EmployeeListPage {
  visit() {
    cy.intercept('GET', '**/api/v2/pim/employees?*').as('employeeList');
    cy.visit('/pim/viewEmployeeList');
    cy.wait('@employeeList');
    return this;
  }

  /** Filters by Employee Id and waits for the matching API call to come back. */
  searchById(employeeId: string) {
    cy.intercept({ method: 'GET', pathname: '**/api/v2/pim/employees', query: { employeeId } }).as('searchById');
    cy.field(/^Employee Id$/i).clear();
    cy.field(/^Employee Id$/i).type(employeeId);
    cy.contains('button[type="submit"]', 'Search').click();
    cy.wait('@searchById');
    return this;
  }

  rows() {
    return cy.get(`${oxd.tableBody} ${oxd.tableRow}`);
  }

  row(text: string) {
    return cy.contains(`${oxd.tableBody} ${oxd.tableRow}`, text);
  }

  /** The "(N) Record(s) Found" / "No Records Found" line above the table. */
  recordCount() {
    return cy.contains('.orangehrm-horizontal-padding span', /Records? Found/);
  }

  deleteRow(text: string) {
    cy.intercept('DELETE', '**/api/v2/pim/employees').as('deleteEmployees');
    this.row(text).find('.bi-trash').closest('button').click();
    cy.get(oxd.dialog).within(() => {
      cy.contains('button', 'Yes, Delete').click();
    });
    return cy.wait('@deleteEmployees').its('response.statusCode').should('eq', 200);
  }

  openRow(text: string) {
    this.row(text).click();
  }
}
