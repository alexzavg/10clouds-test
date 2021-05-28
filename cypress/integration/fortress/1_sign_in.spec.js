import {signInPageElements, signInPageData} from '../../pages/sign-in.js';
import {signUpPageElements} from '../../pages/sign-up.js';
import {dashboardPageElements} from '../../pages/dashboard.js';
import {requests} from '../../support/requests.js';

const {generateToken} = require('authenticator');

describe('Sign In', function() {

    const signInLink = Cypress.env('urls').signIn;
    const dashboardLink = Cypress.env('urls').dashboard;
    const email = Cypress.env('users').first.email;
    const password = Cypress.env('users').first.password;
    const formattedKey = Cypress.env('users').first.formattedKey;
    
    let formattedToken;

    afterEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
    });
 
    it('should sign in & logout via Navbar', function() {

        cy.intercept(requests['auth-cognito']).as('auth-cognito');
        cy.intercept(requests['sign-in']).as('sign-in');
        cy.intercept(requests['user-me']).as('user-me');
        cy.intercept(requests['customer-status']).as('customer-status');
        cy.intercept(requests['protection-scores']).as('protection-scores');
        cy.intercept(requests['customer-statistics']).as('customer-statistics');
        cy.intercept(requests['customer-top-statistics']).as('customer-top-statistics');

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
        cy.wait('@customer-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);

        cy.get(dashboardPageElements.scoreValue).should('be.visible');
        cy.url().should('eq', dashboardLink);

        cy.logout();
        
        cy.get(signInPageElements.loginField).should('be.visible');
        cy.url().should('eq', signInLink);
    });

    it('should validate errors for empty [Email] & [Password] fields', function() {
        cy.visit(signInLink);
        cy.url().should('eq', signInLink);
        cy.get(signInPageElements.loginField).click();
        cy.clickOutside();
        cy.get(signInPageElements.passwordField).click();
        cy.clickOutside();
        cy.contains(signInPageElements.error, signInPageData.errors.emailRequired).should('be.visible');
        cy.contains(signInPageElements.error, signInPageData.errors.passwordRequired).should('be.visible');
        cy.contains(signInPageElements.btnDisabled, signInPageData.buttons.signIn).should('be.visible');
    });

    it('should sign in with invalid password', function() {
        cy.intercept(requests['cognito-idp']).as('cognito-idp');
        cy.visit(signInLink);
        cy.url().should('eq', signInLink);
        cy.signIn(email, 'invalidPassword');
        cy.wait('@cognito-idp').its('response.statusCode').should('eq', 200);
        cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
            cy.contains(signInPageElements.notificationDialogue, signInPageData.errors.invalidCredentials);
            cy.url().should('eq', signInLink);
            cy.wait('@cognito-idp').then((value) => {
                expect(value.response.statusCode).to.equal(400);
                expect(value.response.body.message).to.equal('Incorrect username or password.');
                expect(value.response.body.__type).to.equal('NotAuthorizedException');
            });
        });
    });
 
 });