import {dashboardPageElements} from '../../../../components/dashboard.js'
import {signUpPageElements} from '../../../../components/sign-up.js'
import {companyInfoPageElements, companyInfoPageData} from '../../../../components/companyInfo.js'
import {requests} from '../../../../components/requests.js'
import { getRandomCharLength, getRandomNumberLength } from '../../../../support/dataGenerator.js'

const {generateToken} = require('authenticator')

const signInLink        = Cypress.env('urls').signIn
const companyInfoLink   = Cypress.env('urls').companyInfo
const email             = Cypress.env('users').seventh.email
const password          = Cypress.env('users').seventh.password
const formattedKey      = Cypress.env('users').seventh.formattedKey

const firstName         = getRandomCharLength(10)
const lastName          = getRandomCharLength(10)
const adminEmail        = getRandomCharLength(10) + '@gmail.com'
const currencies        = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'NIS', 'SZL']
const currency          = currencies[Math.floor(Math.random()*currencies.length)]
const country           = 'Ukraine'
const state             = 'Poltavs\'ka Oblast\''
const city              = 'Poltava'
const zip               = getRandomNumberLength(6)
const phoneNumber       = '+485' + getRandomNumberLength(8)
const companyWebAddress = getRandomCharLength(10) + '.com'
const numberOfUsers     = getRandomNumberLength(3)

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

        cy.get('[formcontrolname="firstName"]').clear().type(firstName).should('have.value', firstName)
        cy.get('[formcontrolname="lastName"]').clear().type(lastName).should('have.value', lastName)
        cy.xpath('//div[text() = \'Admin Mail\']/following-sibling::input[@formcontrolname="email"]').clear().type(adminEmail).should('have.value', adminEmail)
        cy.get('[formcontrolname="paymentFPEmail"]').clear().type(adminEmail).should('have.value', adminEmail)
        cy.get('[formcontrolname="providerEmail"]').clear().type(adminEmail).should('have.value', adminEmail)

        cy.get('[formcontrolname="currency"]').clear().type(currency).should('have.value', currency)
        cy.contains('mat-option', currency).click()
        cy.get('[formcontrolname="currency"]').should('have.value', currency)

        cy.get('[formcontrolname="providerFirstName"]').clear().type(firstName).should('have.value', firstName)
        cy.get('[formcontrolname="providerLastName"]').clear().type(lastName).should('have.value', lastName)
        cy.xpath('//div[text() = \'Mail\']/following-sibling::input[@formcontrolname="email"]').clear().type(email).should('have.value', email)
        cy.get('[formcontrolname="address"]').clear().type(adminEmail).should('have.value', adminEmail)

        cy.get('[formcontrolname="country"]').clear().type(country).should('have.value', country)
        cy.contains('mat-option', country).click()
        cy.get('[formcontrolname="country"]').should('have.value', country)

        cy.get('[formcontrolname="state"]').clear().type(state).should('have.value', state)
        cy.contains('mat-option', state).click()
        cy.get('[formcontrolname="state"]').should('have.value', state)

        cy.get('[formcontrolname="city"]').clear().type(city).should('have.value', city)
        cy.get('[formcontrolname="zip"]').clear().type(zip).should('have.value', zip)
        cy.get('[formcontrolname="phoneNumber"]').clear().type(phoneNumber).should('have.value', phoneNumber)
        cy.get('[formcontrolname="companyWebAddress"]').clear().type(companyWebAddress).should('have.value', companyWebAddress)
        cy.get('[formcontrolname="numberOfUsers"]').clear().type(numberOfUsers).should('have.value', numberOfUsers)

        cy.contains('button', 'Save').click()
        cy.contains('button', 'Edit').should('be.visible')
        cy.contains('fortress-success-message', 'Company info has been successfully updated').should('be.visible')
        cy.wait('@customer').its('response.statusCode').should('eq', 200)

        cy.reload()
        cy.wait('@customer').then(val => {
            expect(val.response.statusCode).to.eq(200)
            expect(val.response.body.firstName).to.eq(firstName)
        })
        cy.get('[formcontrolname="firstName"]').should('have.value', firstName)
    })

})