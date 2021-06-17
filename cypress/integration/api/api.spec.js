import {dashboardPageElements} from '../../components/dashboard.js';
import {signUpPageElements} from '../../components/sign-up.js';
import {requests} from '../../support/requests.js';

const {generateToken} = require('authenticator');

describe('API', function() {

    const baseUrl = Cypress.env('apiSuite').baseUrl;
    const signInLink = Cypress.env('urls').signIn;
    const email = Cypress.env('apiSuite').user.email;
    const password = Cypress.env('apiSuite').user.password; 
    const formattedKey = Cypress.env('apiSuite').user.formattedKey;

    let formattedToken;
 
    it('Sign in', function() {
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

    it(`Get [authorization] & [x-id-token]`, function() {
            
    });

    it(`Checking endpoint ${baseUrl}/auth/refreshTokens`, function() {
            
    });

});