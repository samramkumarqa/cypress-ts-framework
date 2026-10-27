import { buildEmployee } from '../../data/employees';
import { employeesApi, type Employee } from '../../api/employeesApi';

/**
 * REST API tests with cy.request against OrangeHRM's /api/v2/pim/employees.
 * They reuse the cached admin session cookie, so no browser UI is involved.
 */
describe('API: PIM employees', { tags: ['@api'] }, () => {
  let createdIds: number[] = [];

  beforeEach(() => {
    createdIds = [];
    cy.loginAsAdmin();
  });

  afterEach(() => {
    employeesApi.delete(createdIds);
  });

  it('create, read, update, delete', { tags: '@smoke' }, () => {
    const employee = buildEmployee();

    employeesApi.create(employee).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body.data).to.include({
        firstName: employee.firstName,
        middleName: employee.middleName,
        lastName: employee.lastName,
        employeeId: employee.employeeId,
      });
      expect(body.data.empNumber).to.be.a('number');
      const empNumber = body.data.empNumber;
      createdIds.push(empNumber);

      employeesApi.get(empNumber).its('body.data').should('include', { empNumber, employeeId: employee.employeeId });

      const renamed = { ...employee, firstName: `${employee.firstName}X`, lastName: `${employee.lastName}Y` };
      employeesApi.updatePersonalDetails(empNumber, renamed).then((update) => {
        expect(update.status).to.eq(200);
        expect(update.body.data).to.include({ firstName: renamed.firstName, lastName: renamed.lastName });
      });

      employeesApi.delete([empNumber]).its('status').should('eq', 200);

      // OrangeHRM checks the employee is accessible before looking it up, so a deleted one is a validation error.
      employeesApi.get(empNumber, false).its('status').should('eq', 422);
    });
  });

  it('search by name returns the created employee with the expected shape', () => {
    const employee = buildEmployee();
    employeesApi.create(employee).then(({ body }) => {
      createdIds.push(body.data.empNumber);

      employeesApi.search(employee.firstName).then(({ status, body: result }) => {
        expect(status).to.eq(200);
        expect(result.meta).to.have.property('total').that.is.a('number').and.is.at.least(1);
        const match = result.data.find((e: Employee) => e.empNumber === body.data.empNumber);
        expect(match, 'created employee in search results').to.exist;
        expect(match).to.have.all.keys(
          'empNumber',
          'employeeId',
          'firstName',
          'middleName',
          'lastName',
          'terminationId',
        );
      });
    });
  });

  it('rejects a duplicate Employee Id with 422', () => {
    const employee = buildEmployee();
    employeesApi.create(employee).then(({ body }) => {
      createdIds.push(body.data.empNumber);

      employeesApi.create(buildEmployee({ employeeId: employee.employeeId }), false).then((dup) => {
        expect(dup.status).to.eq(422);
        if (dup.status === 200) createdIds.push(dup.body.data.empNumber); // clean up if the check ever regresses
      });
    });
  });

  it('rejects an Employee Id longer than 10 characters', () => {
    employeesApi
      .create(buildEmployee({ employeeId: 'X'.repeat(11) }), false)
      .its('status')
      .should('eq', 422);
  });
});

describe('API: authentication', { tags: ['@api'] }, () => {
  it('returns 401 without a session', () => {
    cy.clearAllCookies();
    cy.request({ url: '/api/v2/pim/employees', failOnStatusCode: false }).then(({ status, body }) => {
      expect(status).to.eq(401);
      expect(body).to.have.nested.property('error.message', 'Session expired');
    });
  });
});
