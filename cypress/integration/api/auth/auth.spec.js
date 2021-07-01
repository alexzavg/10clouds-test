import {dashboardPageElements} from '../../../components/dashboard.js'
import {signUpPageElements} from '../../../components/sign-up.js'
import {swaggerSections, swaggerLinks, endpoints} from '../../../components/endpoints.js'

const {generateToken} = require('authenticator')

const baseUrl       = Cypress.env('apiSuite').baseUrl
const signInLink    = Cypress.env('urls').signIn
const email         = Cypress.env('apiSuite').users.first.email
const password      = Cypress.env('apiSuite').users.first.password
const formattedKey  = Cypress.env('apiSuite').users.first.formattedKey
const siteUrl       = Cypress.env('apiSuite').siteUrl
const customerId    = Cypress.env('apiSuite').customerId

let formattedToken

describe(`API - Section ${baseUrl}${swaggerSections['auth']}`, function() {

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

    it(`Refresh tokens ${baseUrl}${swaggerLinks['refresh-tokens']}`, function() {
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
            expect(response.status).to.eq(200)
            expect(response.body.jwtToken).to.have.lengthOf.greaterThan(0)
            expect(response.body.refreshToken).to.have.lengthOf.greaterThan(0)
            expect(response.body.idToken).to.have.lengthOf.greaterThan(0)
        })
    })

    it(`Get Cognito pool settings ${baseUrl}${swaggerLinks['cognito-pool-settings']}`, function() {
        cy.request(
            {
                method: 'GET',
                url: baseUrl + endpoints.auth['cognito-pool-settings'] + `?siteUrl=${siteUrl}`
            }
        ).should((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.region).to.eq('us-east-1')
            expect(response.body.userPoolId).to.eq('us-east-1_4eXAijZrz')
            expect(response.body.userPoolsClientId).to.eq('5kj604040o8fadf368ub29glj3')
        })
    })

    it(`Sign in ${baseUrl}${swaggerLinks['sign-in']}`, function() {
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
            expect(response.status).to.eq(200)
        })
    })

    it(`Sign out ${baseUrl}${swaggerLinks['sign-out']}`, function() {
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
            expect(response.status).to.eq(200)
        })
    })

})