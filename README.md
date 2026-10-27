# Cypress TypeScript Framework

[![Cypress Tests](https://github.com/samramkumarqa/cypress-ts-framework/actions/workflows/cypress.yml/badge.svg)](https://github.com/samramkumarqa/cypress-ts-framework/actions/workflows/cypress.yml)

End-to-end and API test automation for the [OrangeHRM](https://opensource-demo.orangehrmlive.com) HR system, built with **Cypress** and **TypeScript**.

It covers login, the PIM employee lifecycle (add → search → open → delete), the dashboard, and OrangeHRM's REST API. A separate `examples/` suite demonstrates Cypress techniques (frames, dialogs, uploads, downloads, drag and drop, tables) against a practice site.

## Highlights

| Area                  | What it shows                                                                                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page Object Model     | Typed page classes plus a side-menu component; specs read as user steps                                                                                             |
| Fast login            | `cy.session` logs in once and reuses the session across tests and specs                                                                                             |
| API testing           | `cy.request` CRUD tests on `/api/v2/pim/employees`: contract, 422 validation, 401 auth                                                                              |
| API-assisted UI tests | Test data created through the API, and **everything created is deleted afterwards**, even if a test fails                                                           |
| Network control       | `cy.intercept` to wait on real requests (no `cy.wait(5000)`), stub responses to reach empty and populated states, and spy that client-side validation sends nothing |
| Custom commands       | `cy.loginAsAdmin()`, `cy.field('Employee Id')`, `cy.toast('success', …)`, fully typed                                                                               |
| Secrets handling      | Public values via `expose`, the password via Cypress `env` (read with `cy.env`, never logged)                                                                       |
| Tags                  | `@smoke`, `@api`, `@pim`… with `@cypress/grep`                                                                                                                      |
| Quality gates         | Strict TypeScript, ESLint with `eslint-plugin-cypress` (bans fixed waits, `force: true` and committed `.only`)                                                      |
| Reporting             | Mochawesome HTML report with embedded failure screenshots                                                                                                           |
| CI                    | GitHub Actions: lint + typecheck, Chrome on every push, Chrome + Firefox + examples on a weekday schedule                                                           |

## Test coverage

| Spec                        | Tests                                                                                                            |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `auth/login`                | Login + logout, wrong password, unknown user, required fields, protected-page redirect                           |
| `pim/employee-lifecycle`    | Add → verify profile → search → delete, open profile from results, required-field validation                     |
| `pim/employee-list-stubbed` | Rows from a stubbed API, empty state, filter sent to the API                                                     |
| `api/employees-api`         | Create/read/update/delete, search contract, duplicate id, field length, 401 without session                      |
| `dashboard/dashboard`       | Every widget API returns 200, navigation to PIM                                                                  |
| `examples/*`                | Alerts, confirm/prompt, frames, upload (incl. drag-drop), download, new tab, forms, mouse, tables, async content |

## Project structure

```
cypress/
├── e2e/            auth/, pim/, api/, dashboard/  (OrangeHRM suite)
├── examples/       Cypress feature demos (the-internet.herokuapp.com)
├── pages/          Page objects + components/SideMenu
├── api/            employeesApi (cy.request wrapper)
├── data/           buildEmployee() test-data factory (Faker)
├── fixtures/       Stubbed API responses, upload files
└── support/        Custom commands, oxd selectors, global hooks
cypress.config.ts            Main config
cypress.examples.config.ts   Config for the examples suite
```

## Running

Requires Node.js 20+.

```bash
npm ci
npm test                 # full OrangeHRM suite, headless Electron
npm run test:smoke       # @smoke tests only
npm run test:api         # API specs only
npm run test:chrome      # in Chrome
npm run test:examples    # feature demos
npm run open             # interactive Cypress app
```

Report: `cypress/reports/index.html`.

## Configuration

| Variable             | Default                                     | Purpose                                              |
| -------------------- | ------------------------------------------- | ---------------------------------------------------- |
| `ORANGEHRM_URL`      | `https://opensource-demo.orangehrmlive.com` | OrangeHRM instance under test                        |
| `ORANGEHRM_USERNAME` | `Admin`                                     | Admin user (the demo prints these on its login page) |
| `ORANGEHRM_PASSWORD` | `admin123`                                  | Admin password                                       |

## Notes on the shared demo

The public OrangeHRM demo is used by many people at once and is reset regularly. Tests therefore create their own uniquely named data (`Cy…` names, time-based ids), never rely on existing records, and clean up after themselves. Timeouts are generous and CI retries a failing test up to twice.
