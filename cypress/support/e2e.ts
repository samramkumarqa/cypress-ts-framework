import { register as registerCypressGrep } from '@cypress/grep';
import 'cypress-mochawesome-reporter/register';
import './commands';

registerCypressGrep();

// The demo occasionally throws harmless errors from third-party scripts; only fail on our app's own errors.
Cypress.on('uncaught:exception', (err) => {
  if (/ResizeObserver loop|Script error/i.test(err.message)) {
    return false;
  }
  return undefined;
});
