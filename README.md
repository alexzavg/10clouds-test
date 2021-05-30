# Cypress e2e tests for Fortress project
## General info

- Jenkins job which runs the tests https://jenkins.qfortress.ai/job/autotests/job/cypress-dev/

- Slack channel for Jenkins alerts https://fortress-kok8877.slack.com/archives/C01Q1QNJTUZ

- If you run tests locally, the users will be the same as on DEV environment, because local env is pointing to DEV via API.

---
## Installation

1. **Clone this repo to your local machine**

2. **Go to root folder (fortress-cypress-tests)**

3. **Execute commands:**
    - `npm install`
    - `npm install -g "cypress@7.4.0"`
    - `npm install "cypress@7.4.0" cypress-multi-reporters mocha mochawesome mochawesome-merge mochawesome-report-generator cypress-mailosaur cypress-commands cypress-dark "@bahmutov/cypress-extends" --save-dev`

---
## Open Cypress test runner for manual test selection

These commands open Cypress runner on a specific environment. After that you can select the test which you wish to execute. Keep in mind that once test is selected - making any changes to the code will re-run the test. This is embedded into Cypress architechture and can only be undone by closing the test runner manually.

**Open test runner locally:**

- `npm run open:local`

**Open test runner on DEV:**

- `npm run open:dev`
---
## Running tests

**Run tests locally:**
- `npm run cy:run:local`

**Run tests on DEV:**
- `npm run cy:run:dev`

**_HINT_**: video recording is enabled for failed tests on local env, the videos can be found in directory `./cypress/videos`