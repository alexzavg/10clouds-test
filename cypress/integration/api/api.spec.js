import {dashboardPageElements} from '../../components/dashboard.js';
import {signUpPageElements} from '../../components/sign-up.js';
import {endpoints} from '../../support/endpoints.js';

const {generateToken} = require('authenticator');

describe('API', function() {

    const baseUrl = Cypress.env('apiSuite').baseUrl;
    const signInLink = Cypress.env('urls').signIn;
    const email = Cypress.env('apiSuite').user.email;
    const password = Cypress.env('apiSuite').user.password; 
    const formattedKey = Cypress.env('apiSuite').user.formattedKey;

    let formattedToken;

    before(() => {
        // sign in
        cy.visit(signInLink);
        formattedToken = generateToken(formattedKey);
        let array = Array.from(formattedToken);
        cy.signIn(email, password);
        cy.fillOtp(array[0], array[1], array[2], array[3], array[4], array[5]);
        cy.get(signUpPageElements.spinner).should('not.exist');
        cy.get(dashboardPageElements.scoreValue).should('be.visible');

        // get data from local storage
        cy.getLocalStorage('auth.refreshToken').then(val => {
            let refreshToken = val.replaceAll('"', '');
            cy.wrap(refreshToken).as('refreshToken');
        });
        cy.getLocalStorage('auth.idToken').then(val => {
            let idToken = val.replaceAll('"', '');
            cy.wrap(idToken).as('idToken');
        });
        cy.getLocalStorage('auth.accessToken').then(val => {
            let accessToken = val.replaceAll('"', '');
            cy.wrap(accessToken).as('accessToken');
        });
        cy.saveLocalStorage();
    });

    beforeEach(() => {
        cy.restoreLocalStorage();
    });

    it(`Check endpoint ${baseUrl}${endpoints['auth-refresh-tokens']}`, function() {
        cy.request(
            {
                method: 'POST',
                url: baseUrl + endpoints['auth-refresh-tokens'],
                body: {
                    "refreshToken": this.refreshToken,
                    "idToken": this.idToken
                }
            }
        ).should((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.jwtToken).to.have.lengthOf.greaterThan(0);
            expect(response.body.refreshToken).to.have.lengthOf.greaterThan(0);
            expect(response.body.idToken).to.have.lengthOf.greaterThan(0);
          })
    });

});