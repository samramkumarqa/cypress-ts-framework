import { buildEmployee, fullName } from '../../data/employees';
import { employeesApi } from '../../api/employeesApi';
import { AddEmployeePage, EmployeeListPage, PersonalDetailsPage } from '../../pages';

/**
 * Full UI lifecycle on PIM: add an employee, find them, open their profile, delete them.
 * Anything created is also removed through the API afterwards, so a failed run leaves no data behind.
 */
describe('PIM: employee lifecycle', { tags: ['@pim', '@e2e'] }, () => {
  let createdIds: number[] = [];

  beforeEach(() => {
    createdIds = [];
    cy.loginAsAdmin();
  });

  afterEach(() => {
    employeesApi.delete(createdIds);
  });

  it('adds, finds, opens and deletes an employee', { tags: '@smoke' }, () => {
    const employee = buildEmployee();

    // Add
    new AddEmployeePage()
      .visit()
      .create(employee)
      .then((empNumber) => {
        createdIds.push(empNumber);
        // Saving shows a toast and then does a full page load to the new profile, so assert on the
        // profile rather than the short-lived toast.
        const details = new PersonalDetailsPage().waitUntilLoaded(empNumber);
        details.headerName().should('contain.text', employee.firstName).and('contain.text', employee.lastName);
        details.employeeId().should('have.value', employee.employeeId);
      });

    // Find
    const list = new EmployeeListPage().visit().searchById(employee.employeeId);
    list.recordCount().should('have.text', '(1) Record Found');
    list.rows().should('have.length', 1);
    list.row(employee.employeeId).should('contain.text', employee.firstName).and('contain.text', employee.lastName);

    // Delete
    list.deleteRow(employee.employeeId);
    cy.toast('success', 'Successfully Deleted');
    list.searchById(employee.employeeId);
    cy.toast('info', 'No Records Found');
  });

  it('opens the profile from the search results', () => {
    const employee = buildEmployee();
    // Fast setup through the API; the UI navigation is what's under test here.
    employeesApi.create(employee).then(({ body }) => {
      createdIds.push(body.data.empNumber);

      const list = new EmployeeListPage().visit().searchById(employee.employeeId);
      list.openRow(employee.employeeId);

      new PersonalDetailsPage()
        .waitUntilLoaded(body.data.empNumber)
        .headerName()
        .should('contain.text', fullName(employee));
    });
  });

  it('requires first and last name', () => {
    const page = new AddEmployeePage().visit();
    cy.intercept('POST', '**/api/v2/pim/employees', cy.spy().as('createCall'));

    page.submitEmpty();

    cy.get('.oxd-input-field-error-message').should('have.length.at.least', 2).first().should('have.text', 'Required');
    // Client-side validation must stop the request entirely.
    cy.get('@createCall').should('not.have.been.called');
  });
});
