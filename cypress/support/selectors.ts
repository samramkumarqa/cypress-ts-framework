/**
 * OrangeHRM's UI library (oxd) class names, in one place.
 * Taken from the oxd component library and OrangeHRM's own Cypress helpers.
 */
export const oxd = {
  inputGroup: '.oxd-input-group',
  inputs: '.oxd-input, .oxd-select-text-input, .oxd-autocomplete-text-input, .oxd-textarea, .oxd-date-input',
  fieldError: '.oxd-input-field-error-message',
  alertText: '.oxd-alert-content-text',
  toast: '.oxd-toast',
  toastSuccess: '.oxd-toast--success',
  toastInfo: '.oxd-toast--info',
  tableBody: '.oxd-table-body',
  tableRow: '.oxd-table-card',
  breadcrumbModule: '.oxd-topbar-header-breadcrumb-module',
  breadcrumbLevel: '.oxd-topbar-header-breadcrumb-level',
  menuItem: '.oxd-main-menu-item',
  userDropdown: '.oxd-userdropdown-tab',
  userMenuLink: '.oxd-userdropdown-link',
  dialog: '.oxd-dialog-sheet',
  dangerButton: '.oxd-button--label-danger',
  formLoader: '.oxd-form-loader',
} as const;

export type ToastType = 'success' | 'info' | 'warn' | 'error';
