import {dashboardPageElements} from '../../../components/dashboard.js';
import {signUpPageElements} from '../../../components/sign-up.js';
import {sections, endpoints} from '../../../support/endpoints.js';
import {getRandomCharLength, getRandomNumberLength} from '../../../support/dataGenerator.js';

const {generateToken} = require('authenticator');

describe('API', function() {

    const baseUrl       = Cypress.env('apiSuite').baseUrl;
    const signInLink    = Cypress.env('urls').signIn;
    const email         = Cypress.env('apiSuite').users.first.email;
    const password      = Cypress.env('apiSuite').users.first.password;
    const formattedKey  = Cypress.env('apiSuite').users.first.formattedKey;
    const siteUrl       = Cypress.env('apiSuite').siteUrl;
    const customerId    = Cypress.env('apiSuite').customerId;
    const roleId        = Cypress.env('apiSuite').roleId;
    const serverId      = Cypress.env('MAILOSAUR_SERVER_ID');
    const emailDomain   = Cypress.env('email_domain');

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

    describe(`[Auth] section ${baseUrl}${sections.auth}`, function() {

        const firstName     = 'cypress' + getRandomCharLength(8);
        const lastName      = 'cypress' + getRandomCharLength(8);
        const email         = getRandomCharLength(15) + getRandomNumberLength(5) + '@' + serverId + emailDomain;
        const phoneNumber   = '+38098' + getRandomNumberLength(7);

        it(`Refresh tokens ${baseUrl}${endpoints.auth['refresh-tokens']}`, function() {
            cy.request(
                {
                    method: 'POST',
                    url: baseUrl + endpoints.auth['refresh-tokens'],
                    body: {
                        'refreshToken': this.refreshToken,
                        'idToken': this.idToken
                    }
                }
            ).should((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.jwtToken).to.have.lengthOf.greaterThan(0);
                expect(response.body.refreshToken).to.have.lengthOf.greaterThan(0);
                expect(response.body.idToken).to.have.lengthOf.greaterThan(0);
            });
        });

        it(`Get cognito pool settings ${baseUrl}${endpoints.auth['cognito-pool-settings']}`, function() {
            cy.request(
                {
                    method: 'GET',
                    url: baseUrl + endpoints.auth['cognito-pool-settings'] + `?siteUrl=${siteUrl}`
                }
            ).should((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.region).to.eq('us-east-1');
                expect(response.body.userPoolId).to.eq('us-east-1_4eXAijZrz');
                expect(response.body.userPoolsClientId).to.eq('5kj604040o8fadf368ub29glj3');
            });
        });

        it(`Add user ${baseUrl}${endpoints.auth['sign-up']} & remove user ${baseUrl}${endpoints.user['remove']}`, function() {
            cy.request(
                {
                    method: 'POST',
                    url: baseUrl + endpoints.auth['sign-up'],
                    auth: {
                        'bearer': this.accessToken
                    },
                    headers: {
                        'x-customer-id': customerId,
                        'x-id-token': this.idToken
                    },
                    body: {
                        'firstName': firstName,
                        'lastName': lastName,
                        'email': email,
                        'phoneNumber': phoneNumber,
                        'roleId': roleId
                    }
                }
            ).should((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.firstName).to.eq(firstName);
                expect(response.body.lastName).to.eq(lastName);
                expect(response.body.email).to.eq(email);
                expect(response.body.phoneNumber).to.eq(phoneNumber);
                expect(response.body._id).to.eq(response.body.cognitoUserId);
                cy.wrap(response.body._id).as('userId');
            });

            // ! disabled due to bug https://qfortress.atlassian.net/browse/FORT-523
            // cy.request(
            //     {
            //         method: 'POST',
            //         url: baseUrl + endpoints.user['remove'],
            //         auth: {
            //             'bearer': this.accessToken
            //         },
            //         headers: {
            //             'x-customer-id': customerId,
            //             'x-id-token': this.idToken
            //         },
            //         body: {
            //             'userId': this.userId
            //         }
            //     }
            // ).should((response) => {
            //     expect(response.status).to.eq(201);
            // });
        });

        it(`Check if user is logged in ${baseUrl}${endpoints.auth['sign-in']}`, function() {
            cy.request(
                {
                    method: 'POST',
                    url: baseUrl + endpoints.auth['sign-in'],
                    auth: {
                        'bearer': this.accessToken
                    },
                    headers: {
                        'x-customer-id': customerId,
                        'x-id-token': this.idToken
                    }
                }
            ).should((response) => {
                expect(response.status).to.eq(200);
            });
        });

        it(`User logout ${baseUrl}${endpoints.auth['sign-out']}`, function() {
            cy.request(
                {
                    method: 'POST',
                    url: baseUrl + endpoints.auth['sign-out'],
                    auth: {
                        'bearer': this.accessToken
                    },
                    headers: {
                        'x-customer-id': customerId,
                        'x-id-token': this.idToken
                    }
                }
            ).should((response) => {
                expect(response.status).to.eq(200);
            });
        });
    });

});