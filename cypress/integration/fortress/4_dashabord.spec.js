import {dashboardPageElements} from '../../pages/dashboard.js';
import {requests} from '../../support/requests.js';
import {ValidInDays, ValidInWeeks, ValidInMonths, ExtractTimes, ValidInHours} from '../../support/dataGenerator.js';


const {generateToken} = require('authenticator');

describe('Dashboard funcunallity', function() {


    const signInLink = Cypress.env('urls').signIn;
    const dashboardLink = Cypress.env('urls').dashboard;
    const email = Cypress.env('users').first.email;
    const password = Cypress.env('users').first.password;
    const formattedKey = Cypress.env('users').first.formattedKey;

    
    let formattedToken;
 
    it('should login to Fortress with 2FA and logout via Navbar', function() {

        cy.intercept(requests['auth-cognito']).as('auth-cognito');
        cy.intercept(requests['sign-in']).as('sign-in');
        cy.intercept(requests['user-me']).as('user-me');
        cy.intercept(requests['customer-status']).as('customer-status');
        cy.intercept(requests['protection-scores']).as('protection-scores');
        cy.intercept(requests['aggregate-alerts']).as('aggregate-alerts');
        cy.intercept(requests['aggregate-users']).as('aggregate-users');
        cy.intercept(requests['aggregate-endpoints']).as('aggregate-endpoints');
        cy.intercept(requests['customer-statistics']).as('aggregate-customer-statisic');

        cy.visit(signInLink);
        cy.url().should('eq', signInLink);

        formattedToken = generateToken(formattedKey);
        cy.log('Google OTP is:', formattedToken);
        let array = Array.from(formattedToken);
        cy.log(array);
        cy.signIn(email, password);
        cy.wait('@auth-cognito').its('response.statusCode').should('eq', 200);
        cy.fillOtp(array[0], array[1], array[2], array[3], array[4], array[5]);


        cy.wait('@sign-in').its('response.statusCode').should('eq', 200);
        cy.wait('@user-me').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-status').its('response.statusCode').should('eq', 200);
        cy.wait('@protection-scores').its('response.statusCode').should('eq', 200);
        cy.wait('@aggregate-alerts').its('response.statusCode').should('eq', 200);
        cy.wait('@aggregate-users').its('response.statusCode').should('eq', 200);
        cy.wait('@aggregate-endpoints').its('response.statusCode').should('eq', 200);
        cy.wait('@aggregate-customer-statisic').its('response.statusCode').should('eq', 200);
  
        // Check Dropdown last 1 hour
        cy.get('.mat-select-min-line').click();
        cy.contains('.mat-option-text', 'Last 1h').click();
        cy.get('.mat-select-min-line').click();
        cy.contains('.mat-option-text', 'Last 1h').click();
        cy.get('@aggregate-users').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true)
            
        });
        cy.get('@aggregate-endpoints').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true)
            
        });
        cy.get('@aggregate-customer-statisic').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true)
            
        });
        cy.get('@aggregate-alerts').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true)
            
        });

        // Check Dropdown last 6 hour
        cy.get('.mat-select-min-line').click();
        cy.contains('.mat-option-text', 'Last 6h').click();
        cy.get('.mat-select-min-line').click();
        cy.contains('.mat-option-text', 'Last 6h').click();
        cy.get('@aggregate-users').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 6).should('eq', true)
            
        });
        cy.get('@aggregate-endpoints').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 6).should('eq', true)
            
        });
        cy.get('@aggregate-customer-statisic').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 6).should('eq', true)
            
        });
        cy.get('@aggregate-alerts').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 6).should('eq', true)
            
        });

        // Check Dropdown last 12 hour
        cy.get('.mat-select-min-line').click();
        cy.contains('.mat-option-text', 'Last 12h').click();
        cy.get('.mat-select-min-line').click();
        cy.contains('.mat-option-text', 'Last 12h').click();
        cy.get('@aggregate-users').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 12).should('eq', true)
            
        });
        cy.get('@aggregate-endpoints').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 12).should('eq', true)
            
        });
        cy.get('@aggregate-customer-statisic').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 12).should('eq', true)
            
        });
        cy.get('@aggregate-alerts').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 12).should('eq', true)
            
        });

        // Check Dropdown last 24 hour        
        cy.get('.mat-select-min-line').click();
        cy.contains('.mat-option-text', 'Last 24h').click();
        cy.get('.mat-select-min-line').click();
        cy.contains('.mat-option-text', 'Last 24h').click();
        cy.get('@aggregate-users').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 24).should('eq', true)
            
        });
        cy.get('@aggregate-endpoints').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 24).should('eq', true)
            
        });
        cy.get('@aggregate-customer-statisic').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 24).should('eq', true)
            
        });
        cy.get('@aggregate-alerts').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 24).should('eq', true)
            
        });

        // Check Dropdown last 1 week          
        cy.get('.mat-select-min-line').click();
        cy.contains('.mat-option-text', 'Last 1 week').click();
        cy.get('.mat-select-min-line').click();
        cy.contains('.mat-option-text', 'Last 1 week').click();
        cy.get('@aggregate-users').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInWeeks}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true)
            
        });
        cy.get('@aggregate-endpoints').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInWeeks}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true)
            
        });
        cy.get('@aggregate-customer-statisic').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInWeeks}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true)
            
        });
        cy.get('@aggregate-alerts').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInWeeks}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true)
            
        });    

        // Check Dropdown last 3 month //Need fix
        cy.get('.mat-select-min-line').click();
        cy.contains('.mat-option-text', 'Last 3 month').click();
        cy.get('.mat-select-min-line').click();
        cy.contains('.mat-option-text', 'Last 3 month').click();
        cy.get('@aggregate-users').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInDays}).invoke('valid', geturl.start_date, geturl.end_date, 84).should('eq', true)
            
        });
        cy.get('@aggregate-endpoints').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInDays}).invoke('valid', geturl.start_date, geturl.end_date, 84).should('eq', true)
            
        });
        cy.get('@aggregate-customer-statisic').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInDays}).invoke('valid', geturl.start_date, geturl.end_date, 84).should('eq', true)
            
        });
        cy.get('@aggregate-alerts').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInDays}).invoke('valid', geturl.start_date, geturl.end_date, 84).should('eq', true)
            
        });     
        
        
        // Check Top Menu - Regulation
        cy.get('fortress-cards-menu-item.ng-tns-c109-13 > .title').click();

        // Check Top Menu - Top Endpoints
        cy.get('fortress-cards-menu-item.ng-tns-c109-14 > .title').click();

        // Check Top Menu - Top Alerts
        cy.get('fortress-cards-menu-item.ng-tns-c109-15 > .title').click();

        // Check Top Menu - Top Users
        cy.get('fortress-cards-menu-item.ng-tns-c109-16 > .title').click();

        // Check Top Menu - Top News
        cy.get('fortress-cards-menu-item.ng-tns-c109-17 > .title').click();
        

        // Total Top headers
        cy.get('.scroller').click()  //Open

        cy.get('.scroller').click()  //Close

        cy.get(dashboardPageElements.scoreValue).should('be.visible');
        cy.url().should('eq', dashboardLink);

    });


});