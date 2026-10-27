import tseslint from 'typescript-eslint';
import pluginCypress from 'eslint-plugin-cypress';

export default tseslint.config(
  { ignores: ['node_modules', 'cypress/reports', 'cypress/screenshots', 'cypress/videos', 'cypress/downloads'] },
  ...tseslint.configs.recommended,
  {
    files: ['cypress/**/*.ts'],
    ...pluginCypress.configs.recommended,
    rules: {
      ...pluginCypress.configs.recommended.rules,
      'cypress/no-unnecessary-waiting': 'error', // no cy.wait(5000)
      'cypress/no-force': 'error',
      'cypress/no-pause': 'error',
      '@typescript-eslint/no-unused-expressions': 'off', // chai: expect(x).to.be.true
    },
  },
  {
    rules: {
      // Committed focus/skip would silently disable the rest of the suite.
      'no-restricted-properties': [
        'error',
        { object: 'it', property: 'only', message: 'Remove .only before committing.' },
        { object: 'describe', property: 'only', message: 'Remove .only before committing.' },
      ],
    },
  },
);
