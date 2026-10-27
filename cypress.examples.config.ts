import { defineConfig } from 'cypress';
import baseConfig from './cypress.config';

/**
 * Standalone Cypress feature demos against a public practice site.
 * Run with: npm run test:examples
 */
export default defineConfig({
  ...baseConfig,
  expose: {},
  env: {},
  reporterOptions: { ...baseConfig.reporterOptions, reportDir: 'cypress/reports/examples' },
  e2e: {
    ...baseConfig.e2e,
    baseUrl: process.env.EXAMPLES_URL ?? 'https://the-internet.herokuapp.com',
    specPattern: 'cypress/examples/**/*.cy.ts',
  },
});
