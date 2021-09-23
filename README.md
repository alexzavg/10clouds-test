# Cypress tests for Fortress project

Table of contents
=================

<!--ts-->
   * [Installation](#installation)
   * [Open Cypress test runner for manual test selection](#open-cypress-test-runner-for-manual-test-selection)
   * [Run E2E tests](#run-e2e-tests)
   * [Code error checking](#code-error-checking)
   * [Reports](#reports)
     * [Allure](#allure)
<!--te-->

---
## Installation

1. **Execute commands:**
    - :fast_forward: `npm install`
    - :fast_forward: `npm install -g "cypress@8.4.1"`
    - :fast_forward: `npm install --save-dev "cypress@8.4.1" cypress-commands cypress-localstorage-commands eslint eslint-plugin-chai-friendly eslint-plugin-cypress "@shelex/cypress-allure-plugin" allure-commandline cypress-xpath`

---
## Open Cypress test runner for manual test selection

**Open test runner:**
- :fast_forward: `npm run cy:open`

---
## Run E2E tests

**Run all e2e tests:**
- :fast_forward: `npm run cy:run:e2e`

---
## Code error checking
Typical error fixing can be done via `eslint`.

Config file can be found in project root `.eslintrc.json`.

[Eslint rules list](https://eslint.org/docs/rules/)

**check project root folder**
- :fast_forward: `./node_modules/.bin/eslint ./`

**fix errors**
- :fast_forward: `./node_modules/.bin/eslint ./ --fix`

---
## Reports
### Allure
Command sequence for correct report creation

1. move previous results to history
- :fast_forward: `npm run allure:history`

2. remove assets
- :fast_forward: `npm run allure:clear`

3. run required tests, for example:
- :fast_forward: `npm run cy:run:e2e:dev`

4. generate report
- :fast_forward: `npm run allure:report`

5. there are 2 ways to open generated report
- :fast_forward: `npm run allure:open`
  or
- open file `allure-report/index.html`
