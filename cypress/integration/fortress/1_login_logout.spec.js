import {signInPageElements} from '../../pages/sign-in.js';
import {dashboardPageElements} from '../../pages/dashboard.js';
import {navbarElements} from '../../pages/navbar.js';
import {requests} from '../../support/requests.js';

const {generateToken} = require('authenticator');

describe('Login & Logout', function() {

    const signInLink = Cypress.env('urls').signIn;
    const dashboardLink = Cypress.env('urls').dashboard;
    const login = Cypress.env('users').first.email;
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

        cy.visit(signInLink);

        formattedToken = generateToken(formattedKey);
        cy.log('Google OTP is:', formattedToken);
        let array = Array.from(formattedToken);
        cy.log(array);

        cy.url().should('eq', signInLink);
        cy.get(signInPageElements.loginField).type(login).should('have.value', login);
        cy.get(signInPageElements.passwordField).type(password);
        cy.get(signInPageElements.btnSignInFirst).click();

        cy.wait('@auth-cognito').its('response.statusCode').should('eq', 200);

        cy.get(signInPageElements.otpInput).eq(0).type(array[0]).should('have.value', array[0]);
        cy.get(signInPageElements.otpInput).eq(1).type(array[1]).should('have.value', array[1]);
        cy.get(signInPageElements.otpInput).eq(2).type(array[2]).should('have.value', array[2]);
        cy.get(signInPageElements.otpInput).eq(3).type(array[3]).should('have.value', array[3]);
        cy.get(signInPageElements.otpInput).eq(4).type(array[4]).should('have.value', array[4]);
        cy.get(signInPageElements.otpInput).eq(5).type(array[5]).should('have.value', array[5]);
        cy.get(signInPageElements.btnSignInSecond).click();

        cy.wait('@sign-in').its('response.statusCode').should('eq', 200);
        cy.wait('@user-me').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-status').its('response.statusCode').should('eq', 200);
        cy.wait('@protection-scores').its('response.statusCode').should('eq', 200);
        cy.wait('@aggregate-alerts').its('response.statusCode').should('eq', 200);
        cy.wait('@aggregate-users').its('response.statusCode').should('eq', 200);
        cy.wait('@aggregate-endpoints').its('response.statusCode').should('eq', 200);

        cy.get(dashboardPageElements.scoreValue).should('be.visible');
        cy.url().should('eq', dashboardLink);

        cy.get(navbarElements.user).click();
        cy.get(navbarElements.logout).click();

        cy.get(signInPageElements.loginField).should('be.visible');
        cy.url().should('eq', signInLink);
    });
 
 });