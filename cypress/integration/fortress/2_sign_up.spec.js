import {signUpPage} from '../../pages/sign-up.js';
import {dashboardPage} from '../../pages/dashboard.js';
import {requests} from '../../support/requests.js';
import {getRandomCharLength, getRandomNumberLength} from '../../support/dataGenerator.js';

const {generateToken} = require('authenticator');

describe('Sign Up New Customer', function() {

    const signUpLink = Cypress.env('urls').signUp;
    const signInLink = Cypress.env('urls').signIn;
    const dashboardLink = Cypress.env('urls').dashboard;

    const firstName = 'test' + getRandomCharLength(8);

    let formattedKey, formattedToken;

    it('should sign up as new customer', function() {
        
        cy.visit(signUpLink);

        cy.get(signUpPage.firstNameField).type(firstName);

    });

});