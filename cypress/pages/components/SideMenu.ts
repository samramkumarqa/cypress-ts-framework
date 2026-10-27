import { oxd } from '../../support/selectors';

/** Left navigation and the user menu in the top bar; present on every page after login. */
export class SideMenu {
  open(module: 'Admin' | 'PIM' | 'Leave' | 'Time' | 'Recruitment' | 'My Info' | 'Dashboard' | 'Directory') {
    cy.contains(oxd.menuItem, new RegExp(`^${module}$`)).click();
  }

  moduleTitle() {
    return cy.get(oxd.breadcrumbModule);
  }

  logout() {
    cy.get(oxd.userDropdown).click();
    cy.contains(oxd.userMenuLink, 'Logout').click();
  }
}
