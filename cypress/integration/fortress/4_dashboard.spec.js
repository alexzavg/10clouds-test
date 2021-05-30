import {dashboardPageElements, dashboardPageData} from '../../pages/dashboard.js';
import {signUpPageElements} from '../../pages/sign-up.js';
import {alertsPageElements} from '../../pages/alerts.js';
import {requests} from '../../support/requests.js';
import {ValidInDays, ValidInWeeks, PostExtractTimes, ValidInHours, getAllCombos} from '../../support/dataGenerator.js';

const {generateToken} = require('authenticator');

describe('Dashboard functionality', function() {

    const signInLink = Cypress.env('urls').signIn;
    const dashboardLink = Cypress.env('urls').dashboard;
    const alertsLink = Cypress.env('urls').alerts;
    const email = Cypress.env('users').third.email;
    const password = Cypress.env('users').third.password; 
    const formattedKey = Cypress.env('users').third.formattedKey;

    let formattedToken;
 
    it('should login', function() {
        cy.visit(signInLink);
        cy.url().should('eq', signInLink);

        formattedToken = generateToken(formattedKey);
        cy.log('Google OTP is:', formattedToken);
        let array = Array.from(formattedToken);
        cy.log(array);

        cy.signIn(email, password);
        cy.fillOtp(array[0], array[1], array[2], array[3], array[4], array[5]);
        cy.get(signUpPageElements.spinner).should('not.exist');
        cy.get(dashboardPageElements.scoreValue).should('be.visible');
    });

    it.skip('checking', function () {
        cy.get(dashboardPageElements.topMenuOpenBtn).click();
        cy.get(dashboardPageElements.scorllBarChart).should('be.visible');
        cy.get(dashboardPageElements.scrollBarSeverity).should('be.visible');
        cy.get('.severity-container > > > > .name') .should('have.length', 3).then(($els) => {
            const arr = Cypress.$.makeArray($els).map((el) => el.innerText);
            (cy.log(Cypress.$.makeArray($els).map((el) => el.innerText)));
             cy.log(JSON.stringify(getAllCombos(arr)));
            });
        
    });

    it('should check Top Scroll Bar - Open / Closed', function () {
        // Open scroll bar
        cy.get(dashboardPageElements.topMenuOpenBtn).click();
        cy.get(dashboardPageElements.scorllBarChart).should('be.visible');
        cy.get(dashboardPageElements.scrollBarSeverity).should('be.visible');
        // Close scroll bar
        cy.get(dashboardPageElements.topMenuOpenBtn).click();
        cy.get(dashboardPageElements.scrollBarSeverity).should('be.visible');
        cy.get(dashboardPageElements.scrollClosedMenu).should('be.visible');
    });

    it('should check Top Scroll Bar - [High]', function () {
        cy.intercept(requests['customer-top-statistics']).as('customer-top-statistics');
        cy.intercept(requests['customer-statistics']).as('customer-statistics');

        // Opened scroll and Click [High] Severity
        cy.get(dashboardPageElements.topMenuOpenBtn).click();
        cy.get(dashboardPageElements.scorllBarChart).should('be.visible');
        cy.get(dashboardPageElements.scrollBarSeverity).should('be.visible');
        cy.contains(dashboardPageData.severityHigh).click();
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['HIGH']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['HIGH']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['HIGH']);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['HIGH']);
        // Opened scroll and click on [High] Severity to Cancel  
        cy.contains(dashboardPageData.severityHigh).click();
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', []);
        // Closed scroll and Click [High] Severity
        cy.get(dashboardPageElements.topMenuOpenBtn).click();
        cy.get(dashboardPageElements.scrollAlertSummary).should('be.visible');
        cy.get(dashboardPageElements.scrollBarSeverity).should('be.visible');
        cy.get('.alerts-summary > .severity > :nth-child(1)').click(); // Do ..To be fixed
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['HIGH']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['HIGH']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['HIGH']);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['HIGH']);
        // Closed scroll and click on [High] Severity to Cancel
        cy.get('.alerts-summary > .severity > :nth-child(1)').click(); // Undo ..To be fixed
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', []);
        // Opened scroll and click on "X" to Cancel [High] Severity
        cy.get(dashboardPageElements.topMenuOpenBtn).click();
        cy.contains(dashboardPageData.severityHigh).click();
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['HIGH']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['HIGH']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['HIGH']);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['HIGH']);
        cy.get('.severity-container > .severity > .mat-focus-indicator > .mat-button-wrapper > .mat-icon').click(); // Do ..To be fixed
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', []);
        // Closed scroll and click on "X" to Cancel [High] Severity
        cy.get(dashboardPageElements.topMenuOpenBtn).click();
        cy.get(dashboardPageElements.scrollAlertSummary).should('be.visible');
        cy.get(dashboardPageElements.scrollBarSeverity).should('be.visible');
        cy.get('.alerts-summary > .severity > :nth-child(1)').click(); // Do ..To be fixed
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['HIGH']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['HIGH']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['HIGH']);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['HIGH']);
        cy.get('.alerts-summary > .severity > .mat-focus-indicator > .mat-button-wrapper > .mat-icon').click(); // Do ..To be fixed
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', []);
    });

    it('should check Top Scroll Bar - [Medium]', function () {
        cy.intercept(requests['customer-top-statistics']).as('customer-top-statistics');
        cy.intercept(requests['customer-statistics']).as('customer-statistics');

        // Opened scroll and Click [Medium] Severity
        cy.get(dashboardPageElements.topMenuOpenBtn).click();
        cy.get(dashboardPageElements.scorllBarChart).should('be.visible');
        cy.get(dashboardPageElements.scrollBarSeverity).should('be.visible');
        cy.contains(dashboardPageData.severityMedium).click();
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM']);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM']);
        // Opened scroll and click on [Medium] Severity to Cancel  
        cy.contains(dashboardPageData.severityMedium).click();
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', []);
        // Closed scroll and Click [Medium] Severity
        cy.get(dashboardPageElements.topMenuOpenBtn).click();
        cy.get(dashboardPageElements.scrollAlertSummary).should('be.visible');
        cy.get(dashboardPageElements.scrollBarSeverity).should('be.visible');
        cy.get('.alerts-summary > .severity > :nth-child(2)').click(); // Do ..To be fixed
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM']);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM']);
        // Closed scroll and click on [Medium] Severity to Cancel
        cy.get('.alerts-summary > .severity > :nth-child(2)').click(); // Undo ..To be fixed
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', []);
        // Opened scroll and click on "X" to Cancel [Medium] Severity
        cy.get(dashboardPageElements.topMenuOpenBtn).click();
        cy.contains(dashboardPageData.severityMedium).click();
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM']);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM']);
        cy.get('.severity-container > .severity > .mat-focus-indicator > .mat-button-wrapper > .mat-icon').click(); // Do ..To be fixed
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', []);
        // Closed scroll and click on "X" to Cancel [Medium] Severity
        cy.get(dashboardPageElements.topMenuOpenBtn).click();
        cy.get(dashboardPageElements.scrollAlertSummary).should('be.visible');
        cy.get(dashboardPageElements.scrollBarSeverity).should('be.visible');
        cy.get('.alerts-summary > .severity > :nth-child(2)').click(); // Do ..To be fixed
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM']);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM']);
        cy.get('.alerts-summary > .severity > .mat-focus-indicator > .mat-button-wrapper > .mat-icon').click(); // Do ..To be fixed
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', []);
    });

    it('should check Top Scroll Bar - [Low]', function () {
        cy.intercept(requests['customer-top-statistics']).as('customer-top-statistics');
        cy.intercept(requests['customer-statistics']).as('customer-statistics');

        // Opened scroll and Click [Low] Severity
        cy.get(dashboardPageElements.topMenuOpenBtn).click();
        cy.get(dashboardPageElements.scorllBarChart).should('be.visible');
        cy.get(dashboardPageElements.scrollBarSeverity).should('be.visible');
        cy.contains(dashboardPageData.severityLow).click();
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW']);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['LOW']);
        // Opened scroll and click on [Low] Severity to Cancel  
        cy.contains(dashboardPageData.severityLow).click();
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', []);
        // Closed scroll and Click [Low] Severity
        cy.get(dashboardPageElements.topMenuOpenBtn).click();
        cy.get(dashboardPageElements.scrollAlertSummary).should('be.visible');
        cy.get(dashboardPageElements.scrollBarSeverity).should('be.visible');
        cy.get('.alerts-summary > .severity > :nth-child(3)').click(); // Do ..To be fixed
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW']);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['LOW']);
        // Closed scroll and click on [Low] Severity to Cancel
        cy.get('.alerts-summary > .severity > :nth-child(3)').click(); // Undo ..To be fixed
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', []);
        // Opened scroll and click on "X" to Cancel [Low] Severity
        cy.get(dashboardPageElements.topMenuOpenBtn).click();
        cy.contains(dashboardPageData.severityLow).click();
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW']);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['LOW']);
        cy.get('.severity-container > .severity > .mat-focus-indicator > .mat-button-wrapper > .mat-icon').click(); // Do ..To be fixed
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', []);
        // Closed scroll and click on "X" to Cancel [Low] Severity
        cy.get(dashboardPageElements.topMenuOpenBtn).click();
        cy.get(dashboardPageElements.scrollAlertSummary).should('be.visible');
        cy.get(dashboardPageElements.scrollBarSeverity).should('be.visible');
        cy.get('.alerts-summary > .severity > :nth-child(3)').click(); // Do ..To be fixed
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW']);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['LOW']);
        cy.get('.alerts-summary > .severity > .mat-focus-indicator > .mat-button-wrapper > .mat-icon').click(); // Do ..To be fixed
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', []);
    });

    it('should check Top Scroll Bar - [Multple-selction]', function () {
        cy.intercept(requests['customer-top-statistics']).as('customer-top-statistics');
        cy.intercept(requests['customer-statistics']).as('customer-statistics');

        // Open scroll
        cy.get(dashboardPageElements.topMenuOpenBtn).click();
        cy.get(dashboardPageElements.scorllBarChart).should('be.visible');
        cy.get(dashboardPageElements.scrollBarSeverity).should('be.visible');

        // Opened scroll and Click ["Low","Medium"] Severity
        cy.contains(dashboardPageData.severityLow).click();
        cy.contains(dashboardPageData.severityMedium).click();
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM']);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM']);
        // Opened scroll and click on ["Low","Medium"] Severity to Cancel 
        cy.contains(dashboardPageData.severityLow).click();
        cy.contains(dashboardPageData.severityMedium).click();
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', []);
        cy.contains(dashboardPageData.severityLow).click();
        cy.contains(dashboardPageData.severityMedium).click();
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM']);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM']);
        // Opened scroll and click on "X" to Cancel ["Low","Medium"] Severity
        cy.get('.severity-container > .severity > .mat-focus-indicator > .mat-button-wrapper > .mat-icon').click(); // Do ..To be fixed
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', []);

        // Opened scroll and Click ["Low","High"] Severity
        cy.contains(dashboardPageData.severityLow).click();
        cy.contains(dashboardPageData.severityHigh).click();
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'HIGH']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'HIGH']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'HIGH']);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'HIGH']);
        // Opened scroll and click on ["Low","High"] Severity to Cancel 
        cy.contains(dashboardPageData.severityLow).click();
        cy.contains(dashboardPageData.severityHigh).click();
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', []);
        cy.contains(dashboardPageData.severityLow).click();
        cy.contains(dashboardPageData.severityHigh).click();
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'HIGH']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'HIGH']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'HIGH']);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'HIGH']);
        // Opened scroll and click on "X" to Cancel ["Low","High"] Severity
        cy.get('.severity-container > .severity > .mat-focus-indicator > .mat-button-wrapper > .mat-icon').click(); // Do ..To be fixed
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', []);

        // Opened scroll and Click ["Medium","High"] Severity 
        cy.contains(dashboardPageData.severityMedium).click();
        cy.contains(dashboardPageData.severityHigh).click();
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM', 'HIGH']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM', 'HIGH']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM', 'HIGH']);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM', 'HIGH']);
        // Opened scroll and click on ["Medium","High"] Severity to Cancel 
        cy.contains(dashboardPageData.severityMedium).click();
        cy.contains(dashboardPageData.severityHigh).click();
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', []);
        cy.contains(dashboardPageData.severityMedium).click();
        cy.contains(dashboardPageData.severityHigh).click();
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM', 'HIGH']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM', 'HIGH']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM', 'HIGH']);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM', 'HIGH']);
        // Opened scroll and click on "X" to Cancel ["Medium","High"] Severity
        cy.get('.severity-container > .severity > .mat-focus-indicator > .mat-button-wrapper > .mat-icon').click(); // Do ..To be fixed
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', []); 

        // Opened scroll and Click ["Low","Medium","High"] Severity 
        cy.contains(dashboardPageData.severityLow).click();
        cy.contains(dashboardPageData.severityMedium).click();
        cy.contains(dashboardPageData.severityHigh).click();
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM', 'HIGH']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM', 'HIGH']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM', 'HIGH']);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM', 'HIGH']);
        // Opened scroll and click on ["Low","Medium","High"] Severity to Cancel 
        cy.contains(dashboardPageData.severityLow).click();
        cy.contains(dashboardPageData.severityMedium).click();
        cy.contains(dashboardPageData.severityHigh).click();
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', []);
        cy.contains(dashboardPageData.severityLow).click();
        cy.contains(dashboardPageData.severityMedium).click();
        cy.contains(dashboardPageData.severityHigh).click();
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM', 'HIGH']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM', 'HIGH']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM', 'HIGH']);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM', 'HIGH']);
        // Opened scroll and click on "X" to Cancel ["Low","Medium","High"] Severity
        cy.get('.severity-container > .severity > .mat-focus-indicator > .mat-button-wrapper > .mat-icon').click(); // Do ..To be fixed
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', []);

        //// Closed scroll 
        cy.get(dashboardPageElements.topMenuOpenBtn).click();
        cy.get(dashboardPageElements.scrollAlertSummary).should('be.visible');
        cy.get(dashboardPageElements.scrollBarSeverity).should('be.visible');
        // Closed scroll and Click ["Low","Medium"] Severity
        cy.get('.alerts-summary > .severity > :nth-child(3)').click(); // Do ..To be fixed
        cy.get('.alerts-summary > .severity > :nth-child(2)').click(); // Do ..To be fixed
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM']);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM']);
        // Closed scroll and click on ["Low","Medium"] Severity to Cancel
        cy.get('.alerts-summary > .severity > :nth-child(3)').click(); // Do ..To be fixed
        cy.get('.alerts-summary > .severity > :nth-child(2)').click(); // Do ..To be fixed
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', []);
        // Closed scroll and click on "X" to Cancel ["Low","Medium"] Severity
        cy.get('.alerts-summary > .severity > :nth-child(3)').click(); // Do ..To be fixed
        cy.get('.alerts-summary > .severity > :nth-child(2)').click(); // Do ..To be fixed
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM']);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM']);
        cy.get('.alerts-summary > .severity > .mat-focus-indicator > .mat-button-wrapper > .mat-icon').click(); // Do ..To be fixed
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', []);

        // Closed scroll and Click ["Low","High"] Severity
        cy.get('.alerts-summary > .severity > :nth-child(3)').click(); // Do ..To be fixed
        cy.get('.alerts-summary > .severity > :nth-child(1)').click(); // Do ..To be fixed
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'HIGH']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'HIGH']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'HIGH']);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'HIGH']);
        // Closed scroll and click on ["Low","High"] Severity to Cancel
        cy.get('.alerts-summary > .severity > :nth-child(3)').click(); // Do ..To be fixed
        cy.get('.alerts-summary > .severity > :nth-child(1)').click(); // Do ..To be fixed
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', []);
        // Closed scroll and click on "X" to Cancel ["Low","High"] Severity
        cy.get('.alerts-summary > .severity > :nth-child(3)').click(); // Do ..To be fixed
        cy.get('.alerts-summary > .severity > :nth-child(1)').click(); // Do ..To be fixed
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'HIGH']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'HIGH']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'HIGH']);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'HIGH']);
        cy.get('.alerts-summary > .severity > .mat-focus-indicator > .mat-button-wrapper > .mat-icon').click(); // Do ..To be fixed
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', []);

        // Closed scroll and Click ["Medium","High"] Severity
        cy.get('.alerts-summary > .severity > :nth-child(2)').click(); // Do ..To be fixed
        cy.get('.alerts-summary > .severity > :nth-child(1)').click(); // Do ..To be fixed
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM', 'HIGH']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM', 'HIGH']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM', 'HIGH']);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM', 'HIGH']);
        // Closed scroll and click on ["Medium","High"] Severity to Cancel
        cy.get('.alerts-summary > .severity > :nth-child(2)').click(); // Do ..To be fixed
        cy.get('.alerts-summary > .severity > :nth-child(1)').click(); // Do ..To be fixed
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', []);
        // Closed scroll and click on "X" to Cancel ["Medium","High"] Severity
        cy.get('.alerts-summary > .severity > :nth-child(2)').click(); // Do ..To be fixed
        cy.get('.alerts-summary > .severity > :nth-child(1)').click(); // Do ..To be fixed
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM', 'HIGH']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM', 'HIGH']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM', 'HIGH']);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM', 'HIGH']);
        cy.get('.alerts-summary > .severity > .mat-focus-indicator > .mat-button-wrapper > .mat-icon').click(); // Do ..To be fixed
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', []);

        // Closed scroll and Click ["Low","Medium","High"] Severity
        cy.get('.alerts-summary > .severity > :nth-child(3)').click(); // Do ..To be fixed
        cy.get('.alerts-summary > .severity > :nth-child(2)').click(); // Do ..To be fixed
        cy.get('.alerts-summary > .severity > :nth-child(1)').click(); // Do ..To be fixed
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM', 'HIGH']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM', 'HIGH']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM', 'HIGH']);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM', 'HIGH']);
        // Closed scroll and click on ["Low","Medium","High"] Severity to Cancel
        cy.get('.alerts-summary > .severity > :nth-child(3)').click(); // Do ..To be fixed
        cy.get('.alerts-summary > .severity > :nth-child(2)').click(); // Do ..To be fixed
        cy.get('.alerts-summary > .severity > :nth-child(1)').click(); // Do ..To be fixed
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', []);
        // Closed scroll and click on "X" to Cancel ["Low","Medium","High"] Severity
        cy.get('.alerts-summary > .severity > :nth-child(3)').click(); // Do ..To be fixed
        cy.get('.alerts-summary > .severity > :nth-child(2)').click(); // Do ..To be fixed
        cy.get('.alerts-summary > .severity > :nth-child(1)').click(); // Do ..To be fixed
        cy.wait(1500);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM', 'HIGH']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM', 'HIGH']);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM', 'HIGH']);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM', 'HIGH']);
        cy.get('.alerts-summary > .severity > .mat-focus-indicator > .mat-button-wrapper > .mat-icon').click(); // Do ..To be fixed
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', []);
        cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', []);
    });

    it('should check Top Right Dropdown - [Last 1 hour]', function() {
        cy.intercept(requests['customer-top-statistics']).as('customer-top-statistics');
        cy.intercept(requests['customer-statistics']).as('customer-statistics');

        cy.get(dashboardPageElements.dropdownSnapshot).click();
        cy.contains(dashboardPageElements.dropdownSnapshotOption, dashboardPageData.last1Hour).click();
        cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
            cy.wait('@customer-top-statistics').then((interception) => {
                const geturl = PostExtractTimes(interception);
                cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true);
                cy.wait(250);
            });
            cy.wait('@customer-top-statistics').then((interception) => {
                const geturl = PostExtractTimes(interception);
                cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true);
                cy.wait(250);
            });
            cy.wait('@customer-top-statistics').then((interception) => {
                const geturl = PostExtractTimes(interception);
                cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true);
                cy.wait(250);
            });
            cy.wait('@customer-statistics').then((interception) => {
                const geturl = PostExtractTimes(interception);
                cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true);
                cy.wait(250);
            });
        });
    });
    
    it('should check Top Right Dropdown - [Last 6 hour]', function() {
        cy.intercept(requests['customer-top-statistics']).as('customer-top-statistics');
        cy.intercept(requests['customer-statistics']).as('customer-statistics');

        cy.get(dashboardPageElements.dropdownSnapshot).click();
        cy.contains(dashboardPageElements.dropdownSnapshotOption, dashboardPageData.last6hour).click();
        cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
            cy.wait('@customer-top-statistics').then((interception) => {
                const geturl = PostExtractTimes(interception);
                cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 6).should('eq', true);
                cy.wait(250);
            });
            cy.wait('@customer-top-statistics').then((interception) => {
                const geturl = PostExtractTimes(interception);
                cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 6).should('eq', true);
                cy.wait(250);
            });
            cy.wait('@customer-top-statistics').then((interception) => {
                const geturl = PostExtractTimes(interception);
                cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 6).should('eq', true);
                cy.wait(250);
            });
            cy.wait('@customer-statistics').then((interception) => {
                const geturl = PostExtractTimes(interception);
                cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 6).should('eq', true);
                cy.wait(250);
            });
        });
    });

    it('should check Top Right Dropdown - [Last 12 hour]', function() {
        cy.intercept(requests['customer-top-statistics']).as('customer-top-statistics');
        cy.intercept(requests['customer-statistics']).as('customer-statistics');

        cy.get(dashboardPageElements.dropdownSnapshot).click();
        cy.contains(dashboardPageElements.dropdownSnapshotOption, dashboardPageData.last12hour).click();
        cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
            cy.wait('@customer-top-statistics').then((interception) => {
                const geturl = PostExtractTimes(interception);
                cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 12).should('eq', true);
                cy.wait(250);
            });
            cy.wait('@customer-top-statistics').then((interception) => {
                const geturl = PostExtractTimes(interception);
                cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 12).should('eq', true);
                cy.wait(250);
            });
            cy.wait('@customer-top-statistics').then((interception) => {
                const geturl = PostExtractTimes(interception);
                cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 12).should('eq', true);
                cy.wait(250);
            });
            cy.wait('@customer-statistics').then((interception) => {
                const geturl = PostExtractTimes(interception);
                cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 12).should('eq', true);
                cy.wait(250);
            });
        });
    });

    it('should check Top Right Dropdown - [Last 24 hour]', function() {
        cy.intercept(requests['customer-top-statistics']).as('customer-top-statistics');
        cy.intercept(requests['customer-statistics']).as('customer-statistics');

        cy.get(dashboardPageElements.dropdownSnapshot).click();
        cy.contains(dashboardPageElements.dropdownSnapshotOption, dashboardPageData.last24hour).click();
        cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
            cy.wait('@customer-top-statistics').then((interception) => {
                const geturl = PostExtractTimes(interception);
                cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 24).should('eq', true);
                cy.wait(250);
            });
            cy.wait('@customer-top-statistics').then((interception) => {
                const geturl = PostExtractTimes(interception);
                cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 24).should('eq', true);
                cy.wait(250);
            });
            cy.wait('@customer-top-statistics').then((interception) => {
                const geturl = PostExtractTimes(interception);
                cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 24).should('eq', true);
                cy.wait(250);
            });
            cy.wait('@customer-statistics').then((interception) => {
                const geturl = PostExtractTimes(interception);
                cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 24).should('eq', true);
                cy.wait(250);
            });
        });
    });

    it('should check Top Right Dropdown - [Last 1 week] ', function() {
        cy.intercept(requests['customer-top-statistics']).as('customer-top-statistics');
        cy.intercept(requests['customer-statistics']).as('customer-statistics');

        cy.get(dashboardPageElements.dropdownSnapshot).click();
        cy.contains(dashboardPageElements.dropdownSnapshotOption, dashboardPageData.last1week).click();
        cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
            cy.wait('@customer-top-statistics').then((interception) => {
                const geturl = PostExtractTimes(interception);
                cy.wrap({'valid': ValidInWeeks}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true);
                cy.wait(250);
            });
            cy.wait('@customer-top-statistics').then((interception) => {
                const geturl = PostExtractTimes(interception);
                cy.wrap({'valid': ValidInWeeks}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true);
                cy.wait(250);
            });
            cy.wait('@customer-top-statistics').then((interception) => {
                const geturl = PostExtractTimes(interception);
                cy.wrap({'valid': ValidInWeeks}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true);
                cy.wait(250);
            });   
            cy.wait('@customer-statistics').then((interception) => {
                const geturl = PostExtractTimes(interception);
                cy.wrap({'valid': ValidInWeeks}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true);
                cy.wait(250);
            }); 
        });
    });

    it('should check Top Right Dropdown - [Last 3 month]', function() {
        cy.intercept(requests['customer-top-statistics']).as('customer-top-statistics');
        cy.intercept(requests['customer-statistics']).as('customer-statistics');

        cy.get(dashboardPageElements.dropdownSnapshot).click();
        cy.contains(dashboardPageElements.dropdownSnapshotOption, dashboardPageData.Last3month).click();
        cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
            // ! Need dev fix, difference is now in days, should be 3 calendar months
            cy.wait('@customer-top-statistics').then((interception) => {
                const geturl = PostExtractTimes(interception);
                cy.wrap({'valid': ValidInDays}).invoke('valid', geturl.start_date, geturl.end_date, 84).should('eq', true);
                cy.wait(250);
            });
            cy.wait('@customer-top-statistics').then((interception) => {
                const geturl = PostExtractTimes(interception);
                cy.wrap({'valid': ValidInDays}).invoke('valid', geturl.start_date, geturl.end_date, 84).should('eq', true);
                cy.wait(250);
            });
            cy.wait('@customer-top-statistics').then((interception) => {
                const geturl = PostExtractTimes(interception);
                cy.wrap({'valid': ValidInDays}).invoke('valid', geturl.start_date, geturl.end_date, 84).should('eq', true);
                cy.wait(250);
            });  
            cy.wait('@customer-statistics').then((interception) => {
                const geturl = PostExtractTimes(interception);
                cy.wrap({'valid': ValidInDays}).invoke('valid', geturl.start_date, geturl.end_date, 84).should('eq', true);
                cy.wait(250);
            });  
        });
    });

    it('should open & close [Right Menu] - [Regulation]', function() {
        cy.contains(dashboardPageElements.rightMenuCategory, dashboardPageData.regulation).click();
        cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.regulation).should('be.visible');
        cy.get(dashboardPageElements.rightMenuCategoryOpen).should('be.visible');
        cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.regulation).click();
        cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.regulation).should('not.exist');
        cy.get(dashboardPageElements.rightMenuCategoryOpen).should('not.exist');
    });

    it('should open & close [Right Menu] - [Top News]', function() {
        cy.contains(dashboardPageElements.rightMenuCategory, dashboardPageData.topNews).click();
        cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topNews).should('be.visible');
        cy.get(dashboardPageElements.rightMenuCategoryOpen).should('be.visible');
        cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topNews).click();
        cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topNews).should('not.exist');
        cy.get(dashboardPageElements.rightMenuCategoryOpen).should('not.exist');
    });

    it('should open & check redirect to [Alerts] page from [Right Menu] - [Top Endpoints]', function() {
        cy.intercept(requests['customer-top-statistics']).as('customer-top-statistics');
        cy.intercept(requests['protection-scores']).as('protection-scores');
        cy.intercept(requests['service-statistics']).as('service-statistics');
        cy.intercept(requests['device-search']).as('device-search');
        cy.intercept(requests['alert-search']).as('alert-search');

        cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
            cy.contains(dashboardPageElements.rightMenuCategory, dashboardPageData.topEndpoints).click();
            cy.get(dashboardPageElements.rightMenuCategoryOpen).should('be.visible').then(() => {
                cy.wait(1500);
                cy.get(dashboardPageElements.rightMenuCategoryOpen).then((value) => {
                    if (value.text().includes(dashboardPageData.nothingFound)) {
                        cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topEndpoints).click();
                        cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topEndpoints).should('not.exist');
                        cy.get(dashboardPageElements.rightMenuCategoryOpen).should('not.exist');
                    }
                    else {
                        cy.get(dashboardPageElements.rightMenuCategoryOpen).find(dashboardPageElements.rightMenuItem).first().click();
                        cy.url().should('eq', alertsLink);
                        cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                            cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
                            cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
                            cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
                            cy.wait('@protection-scores').its('response.statusCode').should('eq', 200);
                            cy.wait('@service-statistics').its('response.statusCode').should('eq', 200);
                            cy.wait('@device-search').its('response.statusCode').should('eq', 200);
                            cy.wait('@device-search').its('response.statusCode').should('eq', 200);
                            cy.wait('@alert-search').its('response.statusCode').should('eq', 200);
                            cy.get(alertsPageElements.filtersBtn).click();
                            cy.visit(dashboardLink);
                        });
                    }
                });
            });
        });
    });


    it('should open & check redirect to [Alerts] page from [Right Menu] - [Top Alerts]', function() {
        cy.intercept(requests['customer-top-statistics']).as('customer-top-statistics');
        cy.intercept(requests['protection-scores']).as('protection-scores');
        cy.intercept(requests['service-statistics']).as('service-statistics');
        cy.intercept(requests['device-search']).as('device-search');
        cy.intercept(requests['alert-search']).as('alert-search');

        cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
            cy.contains(dashboardPageElements.rightMenuCategory, dashboardPageData.topAlerts).click();
            cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topAlerts).should('be.visible');
            cy.get(dashboardPageElements.rightMenuCategoryOpen).should('be.visible').then(() => {
                cy.wait(1500);
                cy.get(dashboardPageElements.rightMenuCategoryOpen).then((value) => {
                    if (value.text().includes(dashboardPageData.nothingFound)) {
                        cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topAlerts).click();
                        cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topAlerts).should('not.exist');
                        cy.get(dashboardPageElements.rightMenuCategoryOpen).should('not.exist');
                    }
                    else {
                        cy.get(dashboardPageElements.rightMenuCategoryOpen).find(dashboardPageElements.rightMenuItem).first().click();
                        cy.url().should('eq', alertsLink);
                        cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                            cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
                            cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
                            cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
                            cy.wait('@protection-scores').its('response.statusCode').should('eq', 200);
                            cy.wait('@service-statistics').its('response.statusCode').should('eq', 200);
                            cy.wait('@device-search').its('response.statusCode').should('eq', 200);
                            cy.wait('@device-search').its('response.statusCode').should('eq', 200);
                            cy.wait('@alert-search').its('response.statusCode').should('eq', 200);
                            cy.get(alertsPageElements.filtersBtn).click();
                            cy.visit(dashboardLink);
                        });
                    }
                });
            });
        });
    });

    it('should open & check redirect to [Alerts] page from [Right Menu] - [Top Users]', function() {
        cy.intercept(requests['customer-top-statistics']).as('customer-top-statistics');
        cy.intercept(requests['protection-scores']).as('protection-scores');
        cy.intercept(requests['service-statistics']).as('service-statistics');
        cy.intercept(requests['device-search']).as('device-search');
        cy.intercept(requests['alert-search']).as('alert-search');

        cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
            cy.contains(dashboardPageElements.rightMenuCategory, dashboardPageData.topUsers).click();
            cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topUsers).should('be.visible');
            cy.get(dashboardPageElements.rightMenuCategoryOpen).should('be.visible').then(() => {
                cy.wait(1500);
                cy.get(dashboardPageElements.rightMenuCategoryOpen).then((value) => {
                    if (value.text().includes(dashboardPageData.nothingFound)) {
                        cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topUsers).click();
                        cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topUsers).should('not.exist');
                        cy.get(dashboardPageElements.rightMenuCategoryOpen).should('not.exist');
                    }
                    else {
                        cy.get(dashboardPageElements.rightMenuCategoryOpen).find(dashboardPageElements.rightMenuItem).first().click();
                        cy.url().should('eq', alertsLink);
                        cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                            cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
                            cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
                            cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
                            cy.wait('@protection-scores').its('response.statusCode').should('eq', 200);
                            cy.wait('@service-statistics').its('response.statusCode').should('eq', 200);
                            cy.wait('@device-search').its('response.statusCode').should('eq', 200);
                            cy.wait('@device-search').its('response.statusCode').should('eq', 200);
                            cy.wait('@alert-search').its('response.statusCode').should('eq', 200);
                            cy.get(alertsPageElements.filtersBtn).click();
                            cy.visit(dashboardLink);
                        });
                    }
                });
            });
        });
    });
        
});