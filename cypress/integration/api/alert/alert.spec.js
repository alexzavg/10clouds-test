import {dashboardPageElements} from '../../../components/dashboard.js'
import {signUpPageElements} from '../../../components/sign-up.js'
import {swaggerSections, swaggerLinks, endpoints} from '../../../support/endpoints.js'
import {getRandomCharLength, getRandomNumberLength, getCurrentTimeISO} from '../../../support/dataGenerator.js'
import {emailsData} from '../../../support/emailsData.js'

const {generateToken} = require('authenticator')

describe('API', function() {

    const baseUrl       = Cypress.env('apiSuite').baseUrl
    const signInLink    = Cypress.env('urls').signIn
    // todo new user
    const email         = Cypress.env('apiSuite').users.third.email
    const password      = Cypress.env('apiSuite').users.third.password
    const id            = Cypress.env('apiSuite').users.third.id
    const firstName     = Cypress.env('apiSuite').users.third.firstName
    const lastName      = Cypress.env('apiSuite').users.third.lastName
    const phoneNumber   = Cypress.env('apiSuite').users.third.phoneNumber
    const status        = Cypress.env('apiSuite').users.third.status
    const formattedKey  = Cypress.env('apiSuite').users.third.formattedKey
    const customerId    = Cypress.env('apiSuite').customerId

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

    describe(`Section ${baseUrl}${swaggerSections['alert']}`, function() {
        it(`Get current user info ${baseUrl}${swaggerLinks['user-me']}`, function() {
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
    })

})