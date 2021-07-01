import {dashboardPageElements} from '../../../components/dashboard.js'
import {signUpPageElements} from '../../../components/sign-up.js'
import {swaggerSections, swaggerLinks, endpoints} from '../../../components/endpoints.js'

const {generateToken} = require('authenticator')

const baseUrl       = Cypress.env('apiSuite').baseUrl
const signInLink    = Cypress.env('urls').signIn
const email         = Cypress.env('apiSuite').users.sixth.email
const password      = Cypress.env('apiSuite').users.sixth.password
const formattedKey  = Cypress.env('apiSuite').users.sixth.formattedKey
const customerId    = Cypress.env('apiSuite').customerId

let formattedToken

describe(`API - Section ${baseUrl}${swaggerSections['alert']}`, function() {

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

    it(`Search alert ${baseUrl}${swaggerLinks['search-customer-alerts']}`, function() {
        cy.request(
            {
                method: 'POST',
                url: baseUrl + endpoints.alert['alert-search'],
                auth: {
                    'bearer': this.accessToken
                },
                headers: {
                    'x-customer-id': customerId,
                    'x-id-token': this.idToken
                },
                body: {
                    'pagination': {
                        'skip': 0,
                        'take': 25,
                        'sort': 'createdAt',
                        'sortDir': 'DESC'
                    },
                    'status': [
                        'OPEN'
                    ]
                }
            }
        ).should((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('pagination')
            expect(response.body).to.have.property('records')
        })
    })

})