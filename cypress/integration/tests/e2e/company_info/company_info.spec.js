import {dashboardPageElements} from '../../../../components/dashboard.js'
import {signUpPageElements} from '../../../../components/sign-up.js'
import {companyInfoPageElements, companyInfoPageData} from '../../../../components/companyInfo.js'
import {requests} from '../../../../components/requests.js'
import { getRandomCharLength } from '../../../../support/dataGenerator.js'

const {generateToken} = require('authenticator')

const signInLink        = Cypress.env('urls').signIn
const companyInfoLink   = Cypress.env('urls').companyInfo
const email             = Cypress.env('users').seventh.email
const password          = Cypress.env('users').seventh.password
const formattedKey      = Cypress.env('users').seventh.formattedKey
const adminName         = getRandomCharLength(10)

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
        cy.intercept(requests['customer']).as('customer')
        cy.restoreLocalStorage()
    })

    it('Update company info', function() {
        cy.visit(companyInfoLink)
        cy.contains('button', 'Edit').click()
        cy.contains('button', 'Save').should('be.visible')
        cy.get('[formcontrolname="firstName"]').clear().type(adminName).should('have.value', adminName)
        cy.contains('button', 'Save').click()
        cy.contains('button', 'Edit').should('be.visible')
        cy.contains('fortress-success-message', 'Company info has been successfully updated').should('be.visible')
        cy.wait('@customer').its('response.statusCode').should('eq', 200)
        cy.reload()
        cy.wait('@customer').then(val => {
            expect(val.response.statusCode).to.eq(200)
            expect(val.response.body.firstName).to.eq(adminName)
        })
        cy.get('[formcontrolname="firstName"]').should('have.value', adminName)
    })

})