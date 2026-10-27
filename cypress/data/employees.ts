import { faker } from '@faker-js/faker';

export interface NewEmployee {
  firstName: string;
  middleName: string;
  lastName: string;
  /** OrangeHRM allows at most 10 characters. */
  employeeId: string;
}

/**
 * A unique employee for each call. The demo is shared by everyone, so names carry
 * a "Cy" prefix and the id is time-based to avoid clashing with other people's data.
 */
export function buildEmployee(overrides: Partial<NewEmployee> = {}): NewEmployee {
  const unique = `${Date.now()}`.slice(-6) + faker.string.numeric(2);
  return {
    firstName: `Cy${faker.person.firstName()}`.slice(0, 30),
    middleName: faker.person.middleName().slice(0, 30),
    lastName: faker.person.lastName().slice(0, 30),
    employeeId: `C${unique}`.slice(0, 10),
    ...overrides,
  };
}

export const fullName = (e: Pick<NewEmployee, 'firstName' | 'lastName'>): string => `${e.firstName} ${e.lastName}`;
