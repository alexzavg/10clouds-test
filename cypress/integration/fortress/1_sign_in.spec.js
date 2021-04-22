import {signInPage} from './../../pages/sign-in.js';
import {dashboardPage} from './../../pages/dashboard.js';
import {navbar} from './../../pages/navbar.js';
import {requests} from './../../support/requests.js';

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

        cy.visit(signInLink);

        cy.get(signInPage.loginField).type(login);
        cy.get(signInPage.passwordField).type(password);
        cy.get(signInPage.btnSignInFirst).click();

        cy.wait('@auth-cognito').its('response.statusCode').should('eq', 200);
        
        formattedToken = generateToken(formattedKey);
        cy.log('Google OTP is:', formattedToken);
        let array = Array.from(formattedToken);
        cy.log(array);

        cy.get(signInPage.firstNumField).type(array[0]);
        cy.get(signInPage.secondNumField).type(array[1]);
        cy.get(signInPage.thirdNumField).type(array[2]);
        cy.get(signInPage.fourthNumField).type(array[3]);
        cy.get(signInPage.fifthNumField).type(array[4]);
        cy.get(signInPage.sixthNumField).type(array[5]);
        
        cy.get(signInPage.btnSignInSecond).click();

        cy.wait('@sign-in').its('response.statusCode').should('eq', 200);
        cy.wait('@user-me').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-status').its('response.statusCode').should('eq', 200);
        cy.wait('@protection-scores').its('response.statusCode').should('eq', 200);

        cy.get(dashboardPage.scoreValue).should('be.visible');
        cy.url().should('eq', dashboardLink);

        cy.get(navbar.user).click();
        cy.get(navbar.logout).click();

        cy.get(signInPage.loginField).should('be.visible');
        cy.url().should('eq', signInLink);
    });
 
 });