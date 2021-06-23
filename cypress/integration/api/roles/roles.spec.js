import {dashboardPageElements} from '../../../components/dashboard.js';
import {signUpPageElements} from '../../../components/sign-up.js';
import {sections, endpoints} from '../../../support/endpoints.js';
import {getRandomCharLength} from '../../../support/dataGenerator.js';

const {generateToken} = require('authenticator');

describe('API', function() {

    const baseUrl       = Cypress.env('apiSuite').baseUrl;
    const signInLink    = Cypress.env('urls').signIn;
    const userId        = Cypress.env('apiSuite').users.second.id;
    const email         = Cypress.env('apiSuite').users.second.email;
    const password      = Cypress.env('apiSuite').users.second.password;
    const formattedKey  = Cypress.env('apiSuite').users.second.formattedKey;
    const customerId    = Cypress.env('apiSuite').customerId;

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

    describe(`[Role] section ${baseUrl}${sections.role}`, function() {

        const name              = getRandomCharLength(30);
        const description       = getRandomCharLength(30);
        const permission        = 'GET_PROTECTION_SCORE';
        const nameNew           = getRandomCharLength(30);
        const descriptionNew    = getRandomCharLength(30);
        const permissionNew     = 'USER_SEARCH';

        it(`Create role ${baseUrl}${endpoints.role['role']}`, function() {
            cy.request(
                {
                    method: 'POST',
                    url: baseUrl + endpoints.role['role'],
                    auth: {
                        'bearer': this.accessToken
                    },
                    headers: {
                        'x-customer-id': customerId,
                        'x-id-token': this.idToken
                    },
                    body: {
                        "name": name,
                        "permissions": {
                            "root": [
                                permission
                            ],
                            "children": [
                                permission
                            ],
                            "customers": [
                                {
                                    "id": userId,
                                    "permissions": [
                                        permission
                                    ]
                                }
                            ]
                        },
                        "description": description
                    }
                }
            ).then((response) => {
                expect(response.status).to.eq(201);
                expect(response.body.name).to.eq(name);
                expect(response.body.permissions.root).to.contain(permission);
                expect(response.body.permissions.children).to.contain(permission);
                expect(response.body.permissions.customers[0].permissions).to.contain(permission);
                expect(response.body.description).to.eq(description);
                expect(response.body.createdBy).to.eq(userId);
                expect(response.body.createdAt).to.have.lengthOf.greaterThan(0);
                expect(response.body.updatedAt).to.have.lengthOf.greaterThan(0);
                cy.wrap(response.body._id).as('roleId');
            });
        });

        it(`Update role ${baseUrl}${endpoints.role['role']}/${this.roleId}`, function() {
            cy.request(
                {
                    method: 'PATCH',
                    url: baseUrl + endpoints.role['role'] + '/' + this.roleId,
                    auth: {
                        'bearer': this.accessToken
                    },
                    headers: {
                        'x-customer-id': customerId,
                        'x-id-token': this.idToken
                    },
                    body: {
                        "name": nameNew,
                        "permissions": {
                            "root": [
                                permissionNew
                            ],
                            "children": [
                                permissionNew
                            ],
                            "customers": [
                                {
                                    "id": userId,
                                    "permissions": [
                                        permissionNew
                                    ]
                                }
                            ]
                        },
                        "description": descriptionNew
                    }
                }
            ).should((response) => {
                expect(response.status).to.eq(200);
            });
        });

        it(`Get role ${baseUrl}${endpoints.role['role']}/${this.roleId}`, function() {
            cy.request(
                {
                    method: 'GET',
                    url: baseUrl + endpoints.role['role'] + '/' + this.roleId,
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
                expect(response.body.name).to.eq(nameNew);
                expect(response.body.permissions.root).to.contain(permissionNew);
                expect(response.body.permissions.children).to.contain(permissionNew);
                expect(response.body.permissions.customers[0].permissions).to.contain(permissionNew);
                expect(response.body.description).to.eq(descriptionNew);
                expect(response.body.createdBy).to.eq(userId);
                expect(response.body.createdAt).to.have.lengthOf.greaterThan(0);
                expect(response.body.updatedAt).to.have.lengthOf.greaterThan(0);
            });
        });

        // ! due to error 500, reason for error unknown
        // TODO investigate in Swagger
        it.skip(`Search role ${baseUrl}${endpoints.role['role-search']}`, function() {
            cy.request(
                {
                    method: 'POST',
                    url: baseUrl + endpoints.role['role-search'],
                    auth: {
                        'bearer': this.accessToken
                    },
                    headers: {
                        'x-customer-id': customerId,
                        'x-id-token': this.idToken
                    },
                    body: {
                        "name": nameNew,
                        "permissions": [
                            permissionNew
                        ],
                        "description": descriptionNew,
                        "createdBy": userId
                    }
                }
            ).should((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.name).to.eq(nameNew);
                expect(response.body.permissions.root).to.contain(permissionNew);
                expect(response.body.permissions.children).to.contain(permissionNew);
                expect(response.body.permissions.customers[0].permissions).to.contain(permissionNew);
                expect(response.body.description).to.eq(descriptionNew);
                expect(response.body.createdBy).to.eq(userId);
                expect(response.body.createdAt).to.have.lengthOf.greaterThan(0);
                expect(response.body.updatedAt).to.have.lengthOf.greaterThan(0);
            });
        });
    });

});