import { defineConfig } from 'cypress';
import { plugin as cypressGrepPlugin } from '@cypress/grep/plugin';
import mochawesomePlugin from 'cypress-mochawesome-reporter/plugin';

/**
 * Values come from environment variables when set, otherwise from the public OrangeHRM demo.
 * The demo credentials are printed on the demo's own login page, so they're safe defaults.
 *   ORANGEHRM_URL, ORANGEHRM_USERNAME, ORANGEHRM_PASSWORD
 */
const baseUrl = (process.env.ORANGEHRM_URL ?? 'https://opensource-demo.orangehrmlive.com').replace(/\/+$/, '');

export default defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    reportPageTitle: 'OrangeHRM Cypress Report',
    embeddedScreenshots: true,
    inlineAssets: true,
    charts: true,
  },

  // Public values, read in tests with Cypress.expose('key')
  expose: {
    adminUsername: process.env.ORANGEHRM_USERNAME ?? 'Admin',
  },
  // Secrets, read in tests with cy.env(['key']); never logged or exposed to the app
  env: {
    adminPassword: process.env.ORANGEHRM_PASSWORD ?? 'admin123',
  },

  viewportWidth: 1440,
  viewportHeight: 900,
  // The shared demo can be slow, so allow generous timeouts and retry in CI only.
  defaultCommandTimeout: 15_000,
  pageLoadTimeout: 60_000,
  retries: { runMode: 2, openMode: 0 },
  video: false,
  screenshotOnRunFailure: true,

  e2e: {
    baseUrl: `${baseUrl}/web/index.php`,
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      mochawesomePlugin(on);
      cypressGrepPlugin(config);
      return config;
    },
  },
});
