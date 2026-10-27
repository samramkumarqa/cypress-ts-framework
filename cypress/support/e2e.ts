import { register as registerCypressGrep } from '@cypress/grep';
import 'cypress-mochawesome-reporter/register';
import './commands';

registerCypressGrep();

/**
 * Ignore only known, harmless errors; anything else still fails the test.
 * - ResizeObserver / cross-origin "Script error": browser noise from third-party scripts.
 * - "reading 'response'" in an unhandled promise: OrangeHRM's API error handler reads error.response,
 *   which is undefined when a request is aborted because the page navigated away (e.g. logging out while
 *   dashboard widgets are still loading). It's an app bug unrelated to what the tests check.
 */
Cypress.on('uncaught:exception', (err, _runnable, promise) => {
  if (/ResizeObserver loop|Script error/i.test(err.message)) {
    return false;
  }
  if (promise && err.message.includes("Cannot read properties of undefined (reading 'response')")) {
    return false;
  }
  return undefined;
});
