import {dashboardPageElements} from '../../../../components/dashboard.js'
import {signUpPageElements} from '../../../../components/sign-up.js'
import {getRandomCharLength, getRandomNumberLength, getCurrentTimeISO} from '../../../../support/dataGenerator.js'
import {emailsData} from '../../../../components/emailsData.js'
import {requestTypes, swaggerSections, swaggerLinks, endpoints} from '../../../../components/endpoints.js'

const {generateToken} = require('authenticator')

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
const siteUrl       = Cypress.env('apiSuite').siteUrl
const currentTime   = getCurrentTimeISO()

let formattedToken

describe(`API - Section ${baseUrl}${swaggerSections['user']}`, function() {

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


    describe('Existing user', function() {
        it(`Get current user info ${baseUrl}${swaggerLinks['user-me']}`, function() {
            cy.request(
                {
                    method: requestTypes.get,
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

        it(`Get user by id ${baseUrl}${swaggerLinks['get-user-by-id']}`, function() {
            cy.request(
                {
                    method: requestTypes.get,
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

        it(`Find user ${baseUrl}${swaggerLinks['find-users']}`, function() {
            cy.request(
                {
                    method: requestTypes.post,
                    url: baseUrl + endpoints.user['user-search'],
                    auth: {
                        'bearer': this.accessToken
                    },
                    headers: {
                        'x-customer-id': customerId,
                        'x-id-token': this.idToken
                    },
                    body: {
                        'fullTextSearch': {
                            'fields': [
                                'email',
                                'firstName',
                                'lastName'
                            ],
                            'value': email
                        }
                    }
                }
            ).should((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.records[0].cognitoUserId).to.eq(id)
                expect(response.body.records[0].firstName).to.eq(firstName)
                expect(response.body.records[0].lastName).to.eq(lastName)
                expect(response.body.records[0].email).to.eq(email)
                expect(response.body.records[0].phoneNumber).to.eq(phoneNumber)
                expect(response.body.records[0]._id).to.eq(id)
                expect(response.body.records[0].status).to.eq(status)
            })
        })
    })

    describe('Existing user - reset & change password', function() {

        const resetPswdUserEmail    = Cypress.env('apiSuite').users.fourth.email
        const resetPswdUserPassword = Cypress.env('apiSuite').users.fourth.password

        it(`Reset password ${baseUrl}${swaggerLinks['user-reset-password']}`, function() {
            cy.request(
                {
                    method: requestTypes.post,
                    url: baseUrl + endpoints.user['user-password-reset'],
                    body: {
                        'email': resetPswdUserEmail,
                        'siteUrl': siteUrl
                    }
                }
            ).should((response) => {
                expect(response.status).to.eq(201)
                expect(response.body.email).to.eq(resetPswdUserEmail)
                expect(response.body.siteUrl).to.eq(siteUrl)
            })

            // get code from email
            cy.mailosaurGetMessage(serverId, {
                sentFrom: emailsData.emails.support,
                sentTo: resetPswdUserEmail,
                subject: emailsData.subjects.resetUserPassword
            }, {
                receivedAfter: new Date(currentTime),
                timeout: 60000
            }).then(mail => {
                const body = mail.text.body
                let confirmationCode = body.split('following verification code\n\n')[1].slice(0,6)
                cy.log(confirmationCode)
                cy.wrap(confirmationCode).as('confirmationCode')
            })
        })

        it(`Change password ${baseUrl}${swaggerLinks['user-change-password']}`, function() {
            cy.request(
                {
                    method: requestTypes.post,
                    url: baseUrl + endpoints.user['user-password-change'],
                    body: {
                        'verificationCode': this.confirmationCode,
                        'newPassword': resetPswdUserPassword,
                        'email': resetPswdUserEmail,
                        'siteUrl': siteUrl
                    }
                }
            ).should((response) => {
                expect(response.status).to.eq(201)
                expect(response.body.email).to.eq(resetPswdUserEmail)
                expect(response.body.siteUrl).to.eq(siteUrl)
            })
        })
    })

    // ! due to bug https://qfortress.atlassian.net/browse/FORT-650
    describe.skip('Existing user - reset MFA', function() {
        const resetMfaUserId = Cypress.env('apiSuite').users.fifth.id

        it(`Reset MFA ${baseUrl}${swaggerLinks['reset-user-mfa']}`, function() {
            cy.request(
                {
                    method: requestTypes.post,
                    url: baseUrl + endpoints.user['user-mfa-reset'],
                    auth: {
                        'bearer': this.accessToken
                    },
                    headers: {
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

    describe('New user', function() {

        const firstName     = 'cypress' + getRandomCharLength(8)
        const lastName      = 'cypress' + getRandomCharLength(8)
        const email         = getRandomCharLength(15) + getRandomNumberLength(5) + '@' + serverId + emailDomain
        const phoneNumber   = '+38098' + getRandomNumberLength(7)

        it(`Create user ${baseUrl}${swaggerLinks['sign-up']}`, function() {
            cy.request(
                {
                    method: requestTypes.post,
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

        it(`Update user ${baseUrl}${swaggerLinks['update-user']}`, function() {
            cy.request(
                {
                    method: requestTypes.patch,
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
        it.skip(`Remove user ${baseUrl}${swaggerLinks['remove-user']}`, function() {
            cy.request(
                {
                    method: requestTypes.post,
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