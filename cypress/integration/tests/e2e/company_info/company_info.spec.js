import {dashboardPageElements} from '../../../../components/dashboard.js'
import {navbarElements, navbarData} from '../../../../components/navbar.js'
import {signUpPageElements} from '../../../../components/sign-up.js'

const {generateToken} = require('authenticator')

const signInLink        = Cypress.env('urls').signIn
const companyInfoLink   = Cypress.env('urls').companyInfo
const email             = Cypress.env('users').seventh.email
const password          = Cypress.env('users').seventh.password
const formattedKey      = Cypress.env('users').seventh.formattedKey

let formattedToken

describe('Company Info', function() {

    before(() => {
        // sign in
        cy.visit(signInLink)
        formattedToken = generateToken(formattedKey)
        let array = Array.from(formattedToken)
        cy.signIn(email, password)
        cy.fillOtp(array[0], array[1], array[2], array[3], array[4], array[5])
        cy.get(signUpPageElements.spinner).should('not.exist')
        cy.get(dashboardPageElements.scoreValue).should('be.visible')
        cy.saveLocalStorage()
    })

    beforeEach(() => {
        cy.restoreLocalStorage()
    })

    it('Update company info', function() {
        cy.visit(companyInfoLink)
        
    })

})