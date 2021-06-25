import {dashboardPageElements} from '../../../components/dashboard.js'
import {signUpPageElements} from '../../../components/sign-up.js'
import {swaggerSections, swaggerLinks, endpoints} from '../../../support/endpoints.js'
import {getRandomCharLength, getRandomNumberLength} from '../../../support/dataGenerator.js'

const {generateToken} = require('authenticator')

describe('API', function() {

    const baseUrl       = Cypress.env('apiSuite').baseUrl
    const signInLink    = Cypress.env('urls').signIn
    const email         = Cypress.env('apiSuite').users.third.email
    const password      = Cypress.env('apiSuite').users.third.password
    const id            = Cypress.env('apiSuite').users.third.id
    const firstName     = Cypress.env('apiSuite').users.third.firstName
    const lastName      = Cypress.env('apiSuite').users.third.lastName
    const phoneNumber   = Cypress.env('apiSuite').users.third.phoneNumber
    const status        = Cypress.env('apiSuite').users.third.status
    const formattedKey  = Cypress.env('apiSuite').users.third.formattedKey
    const customerId    = Cypress.env('apiSuite').customerId
    const roleId        = Cypress.env('apiSuite').roleId
    const serverId      = Cypress.env('MAILOSAUR_SERVER_ID')
    const emailDomain   = Cypress.env('email_domain')

    let formattedToken

    before(() => {
        // sign in
        cy.visit(signInLink)
        formattedToken = generateToken(formattedKey)
        let array = Array.from(formattedToken)
        cy.signIn(email, password)
        cy.fillOtp(array[0], array[1], array[2], array[3], array[4], array[5])
        cy.get(signUpPageElements.spinner).should('not.exist')
        cy.get(dashboardPageElements.scoreValue).should('be.visible')

        // get data from local storage
        cy.getLocalStorage('auth.refreshToken').then(val => {
            let refreshToken = val.replaceAll('"', '')
            cy.wrap(refreshToken).as('refreshToken')
        })
        cy.getLocalStorage('auth.idToken').then(val => {
            let idToken = val.replaceAll('"', '')
            cy.wrap(idToken).as('idToken')
        })
        cy.getLocalStorage('auth.accessToken').then(val => {
            let accessToken = val.replaceAll('"', '')
            cy.wrap(accessToken).as('accessToken')
        })
        cy.saveLocalStorage()
    })

    beforeEach(() => {
        cy.restoreLocalStorage()
    })

    describe(`Section ${baseUrl}${swaggerSections['user']}`, function() {

        describe('Existing user', function() {
            it(`Request ${baseUrl}${swaggerLinks['user-me']}`, function() {
                cy.request(
                    {
                        method: 'GET',
                        url: baseUrl + endpoints.user['user-me'],
                        auth: {
                            'bearer': this.accessToken
                        },
                        headers: {
                            'x-customer-id': customerId,
                            'x-id-token': this.idToken
                        }
                    }
                ).should((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body.cognitoUserId).to.eq(id)
                    expect(response.body.firstName).to.eq(firstName)
                    expect(response.body.lastName).to.eq(lastName)
                    expect(response.body.email).to.eq(email)
                    expect(response.body.phoneNumber).to.eq(phoneNumber)
                    expect(response.body._id).to.eq(id)
                    expect(response.body.status).to.eq(status)
                })
            })

            it(`Request ${baseUrl}${swaggerLinks['get-user-by-id']}`, function() {
                cy.request(
                    {
                        method: 'GET',
                        url: baseUrl + endpoints.user['user'] + '/' + id,
                        auth: {
                            'bearer': this.accessToken
                        },
                        headers: {
                            'x-customer-id': customerId,
                            'x-id-token': this.idToken
                        }
                    }
                ).should((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body.cognitoUserId).to.eq(id)
                    expect(response.body.firstName).to.eq(firstName)
                    expect(response.body.lastName).to.eq(lastName)
                    expect(response.body.email).to.eq(email)
                    expect(response.body.phoneNumber).to.eq(phoneNumber)
                    expect(response.body._id).to.eq(id)
                    expect(response.body.status).to.eq(status)
                })
            })
        })

        describe('New user', function() {

            const firstName     = 'cypress' + getRandomCharLength(8)
            const lastName      = 'cypress' + getRandomCharLength(8)
            const email         = getRandomCharLength(15) + getRandomNumberLength(5) + '@' + serverId + emailDomain
            const phoneNumber   = '+38098' + getRandomNumberLength(7)

            it(`Request ${baseUrl}${swaggerLinks['sign-up']}`, function() {
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
                    expect(response.status).to.eq(200)
                    expect(response.body.firstName).to.eq(firstName)
                    expect(response.body.lastName).to.eq(lastName)
                    expect(response.body.email).to.eq(email)
                    expect(response.body.phoneNumber).to.eq(phoneNumber)
                    expect(response.body._id).to.eq(response.body.cognitoUserId)
                    cy.wrap(response.body._id).as('userId')
                })
            })

            it(`Request ${baseUrl}${swaggerLinks['update-user']}`, function() {
                cy.request(
                    {
                        method: 'PATCH',
                        url: baseUrl + endpoints.user['user'] + '/' + this.userId,
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
                            'phoneNumber': phoneNumber,
                            'status': true,
                            'role': 'Organization Admin',
                            'score': 1,
                            'expirationDate': '2121-06-18T11:05:21.270Z',
                            'expirationPass': '2121-06-18T11:05:21.270Z'
                        }
                    }
                ).should((response) => {
                    expect(response.status).to.eq(200)
                })
            })
    
            // ! disabled due to bug https://qfortress.atlassian.net/browse/FORT-523
            it.skip(`Request ${baseUrl}${swaggerLinks['remove-user']}`, function() {
                cy.request(
                    {
                        method: 'POST',
                        url: baseUrl + endpoints.user['user-remove'],
                        auth: {
                            'bearer': this.accessToken
                        },
                        headers: {
                            'x-customer-id': customerId,
                            'x-id-token': this.idToken
                        },
                        body: {
                            'userId': this.userId
                        }
                    }
                ).should((response) => {
                    expect(response.status).to.eq(201)
                })
            })
        })
    })

})