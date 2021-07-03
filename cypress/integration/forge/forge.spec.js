import {alertsPageElements} from '../../../components/alerts.js'
import {dashboardPageElements, dashboardPageData} from '../../../components/dashboard.js'
import {emailsData} from '../../../components/dashboard.js'
import {requestTypes, swaggerSections, swaggerLinks, endpoints} from '../../../components/endpoints.js'
import {envs} from '../../../components/envs.js'
import {msspPageElements, msspPageData} from '../../../components/mssp.js'
import {navbarElements, navbarData} from '../../../components/navbar.js'
import {requests} from '../../../components/requests.js'
import {signInPageElements, signInPageData} from '../../../components/sign-in.js'
import {signUpPageElements, signUpPageData} from '../../../components/sign-up.js'
import {usersPageElements, usersPageData} from '../../../components/users.js'

const {generateToken} = require('authenticator')

const baseUrl       = Cypress.env('apiSuite').baseUrl
const signInLink    = Cypress.env('urls').signIn
const email         = Cypress.env('apiSuite').users.first.email
const password      = Cypress.env('apiSuite').users.first.password
const formattedKey  = Cypress.env('apiSuite').users.first.formattedKey
const siteUrl       = Cypress.env('apiSuite').siteUrl
const customerId    = Cypress.env('apiSuite').customerId

let formattedToken

describe('Spec', function() {

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

    it('Test 1', function() {
        
    })

    it('Test 2', function() {
        
    })

    it('Test 2', function() {
        
    })

})