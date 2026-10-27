import type { NewEmployee } from '../data/employees';

/**
 * OrangeHRM's own REST API (the same endpoints its Vue front end calls).
 * Requests reuse the logged-in browser session cookie, so no token handling is needed.
 * Used for fast test setup and cleanup, and for the API specs themselves.
 */
const EMPLOYEES = '/api/v2/pim/employees';

export interface Employee {
  empNumber: number;
  employeeId: string;
  firstName: string;
  middleName: string;
  lastName: string;
}

interface ApiResponse<T> {
  data: T;
  meta: Record<string, unknown>;
  rels: unknown[];
}

const json = { 'Content-Type': 'application/json', Accept: 'application/json' };

export const employeesApi = {
  create(employee: NewEmployee, failOnStatusCode = true) {
    return cy.request<ApiResponse<Employee>>({
      method: 'POST',
      url: EMPLOYEES,
      headers: json,
      body: { ...employee, empPicture: null },
      failOnStatusCode,
    });
  },

  get(empNumber: number, failOnStatusCode = true) {
    return cy.request<ApiResponse<Employee>>({
      url: `${EMPLOYEES}/${empNumber}`,
      headers: json,
      failOnStatusCode,
    });
  },

  search(nameOrId: string) {
    return cy.request<ApiResponse<Employee[]>>({
      url: EMPLOYEES,
      headers: json,
      qs: { nameOrId, includeEmployees: 'onlyCurrent', limit: 50, offset: 0 },
    });
  },

  /**
   * PUT replaces every personal-details field, so send the full set the UI sends,
   * leaving the optional ones empty.
   */
  updatePersonalDetails(
    empNumber: number,
    names: Pick<Employee, 'firstName' | 'middleName' | 'lastName' | 'employeeId'>,
  ) {
    return cy.request<ApiResponse<Employee>>({
      method: 'PUT',
      url: `${EMPLOYEES}/${empNumber}/personal-details`,
      headers: json,
      body: {
        ...names,
        otherId: '',
        drivingLicenseNo: '',
        drivingLicenseExpiredDate: null,
        gender: null,
        maritalStatus: null,
        birthday: null,
        nationalityId: null,
      },
    });
  },

  /** Deletes the given employees. Unknown ids are ignored, so it is safe in cleanup hooks. */
  delete(empNumbers: number[]) {
    if (empNumbers.length === 0) return cy.wrap(null);
    return cy.request({
      method: 'DELETE',
      url: EMPLOYEES,
      headers: json,
      body: { ids: empNumbers },
      failOnStatusCode: false,
    });
  },
};
