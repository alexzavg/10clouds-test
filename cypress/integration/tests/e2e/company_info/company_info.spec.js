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

const taxNumber         = getRandomNumberLength(12)
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

// ! due to performance issue
describe.skip('Company Info', function() {

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

        cy.contains(companyInfoPageElements.btn, companyInfoPageData.edit).scrollIntoView().click()
        cy.contains(companyInfoPageElements.btn, companyInfoPageData.save).should('be.visible')

        cy.get(companyInfoPageElements.taxNumberField).scrollIntoView().clear().type(taxNumber).should('have.value', taxNumber)
        cy.get(companyInfoPageElements.firstNameField).scrollIntoView().clear().type(firstName).should('have.value', firstName)
        cy.get(companyInfoPageElements.lastNameField).scrollIntoView().clear().type(lastName).should('have.value', lastName)
        cy.xpath(companyInfoPageElements.adminMailField).scrollIntoView().clear().type(adminEmail).should('have.value', adminEmail)
        cy.get(companyInfoPageElements.paymentFPEmailField).scrollIntoView().clear().type(adminEmail).should('have.value', adminEmail)
        cy.get(companyInfoPageElements.providerEmailField).scrollIntoView().clear().type(adminEmail).should('have.value', adminEmail)

        cy.get(companyInfoPageElements.currencyField).scrollIntoView().clear().type(currency).should('have.value', currency)
        cy.contains(companyInfoPageElements.dropdownOption, currency).scrollIntoView().click()
        cy.get(companyInfoPageElements.currencyField).scrollIntoView().should('have.value', currency)

        cy.get(companyInfoPageElements.providerFirstNameField).scrollIntoView().clear().type(firstName).should('have.value', firstName)
        cy.get(companyInfoPageElements.providerLastNameField).scrollIntoView().clear().type(lastName).should('have.value', lastName)
        cy.xpath(companyInfoPageElements.emailField).scrollIntoView().clear().type(adminEmail).should('have.value', adminEmail)
        cy.get(companyInfoPageElements.addressField).scrollIntoView().clear().type(adminEmail).should('have.value', adminEmail)

        cy.get(companyInfoPageElements.countryField).scrollIntoView().clear().type(country).should('have.value', country)
        cy.contains(companyInfoPageElements.dropdownOption, country).scrollIntoView().click()
        cy.get(companyInfoPageElements.countryField).scrollIntoView().should('have.value', country)

        cy.get(companyInfoPageElements.stateField).scrollIntoView().clear().type(state).should('have.value', state)
        cy.contains(companyInfoPageElements.dropdownOption, state).scrollIntoView().click()
        cy.get(companyInfoPageElements.stateField).scrollIntoView().should('have.value', state)

        cy.get(companyInfoPageElements.cityField).scrollIntoView().clear().type(city).should('have.value', city)
        cy.get(companyInfoPageElements.zipField).scrollIntoView().clear().type(zip).should('have.value', zip)
        cy.get(companyInfoPageElements.phoneNumberField).scrollIntoView().clear().type(phoneNumber).should('have.value', phoneNumber)
        cy.get(companyInfoPageElements.companyWebAddressField).scrollIntoView().clear().type(companyWebAddress).should('have.value', companyWebAddress)
        cy.get(companyInfoPageElements.numberOfUsersField).scrollIntoView().clear().type(numberOfUsers).should('have.value', numberOfUsers)

        cy.contains(companyInfoPageElements.btn, companyInfoPageData.save).scrollIntoView().click()
        cy.contains(companyInfoPageElements.btn, companyInfoPageData.edit).should('be.visible')
        cy.contains(companyInfoPageElements.alertSuccess, companyInfoPageData.companyUpdatedSuccess).should('be.visible')
        cy.wait('@customer').its('response.statusCode').should('eq', 200)

        cy.reload()
        cy.wait('@customer').then(val => {
            expect(val.response.statusCode).to.eq(200)
            expect(val.response.body.taxNumber).to.eq(taxNumber)
            expect(val.response.body.firstName).to.eq(firstName)
            expect(val.response.body.lastName).to.eq(lastName)
            expect(val.response.body.email).to.eq(adminEmail)
            expect(val.response.body.paymentFPEmail).to.eq(adminEmail)
            expect(val.response.body.providerEmail).to.eq(adminEmail)
            expect(val.response.body.currency).to.eq(currency)
            expect(val.response.body.providerFirstName).to.eq(firstName)
            expect(val.response.body.providerLastName).to.eq(lastName)
            expect(val.response.body.providerEmail).to.eq(adminEmail)
            expect(val.response.body.address).to.eq(adminEmail)
            expect(val.response.body.country).to.eq(country)
            expect(val.response.body.state).to.eq(state)
            expect(val.response.body.city).to.eq(city)
            expect(val.response.body.zip).to.eq(zip)
            expect(val.response.body.phoneNumber).to.eq(phoneNumber)
            expect(val.response.body.companyWebAddress).to.eq(companyWebAddress)
            expect(val.response.body.numberOfUsers).to.eq(+numberOfUsers)
        })

        cy.get(companyInfoPageElements.taxNumberField).should('have.value', taxNumber)
        cy.get(companyInfoPageElements.firstNameField).should('have.value', firstName)
        cy.get(companyInfoPageElements.lastNameField).should('have.value', lastName)
        cy.xpath(companyInfoPageElements.adminMailField).should('have.value', adminEmail)
        cy.get(companyInfoPageElements.paymentFPEmailField).should('have.value', adminEmail)
        cy.get(companyInfoPageElements.providerEmailField).should('have.value', adminEmail)
        cy.get(companyInfoPageElements.currencyField).should('have.value', currency)
        cy.get(companyInfoPageElements.providerFirstNameField).should('have.value', firstName)
        cy.get(companyInfoPageElements.providerLastNameField).should('have.value', lastName)
        cy.xpath(companyInfoPageElements.emailField).should('have.value', adminEmail)
        cy.get(companyInfoPageElements.addressField).should('have.value', adminEmail)
        cy.get(companyInfoPageElements.countryField).should('have.value', country)
        cy.get(companyInfoPageElements.stateField).should('have.value', state)
        cy.get(companyInfoPageElements.cityField).should('have.value', city)
        cy.get(companyInfoPageElements.zipField).should('have.value', zip)
        cy.get(companyInfoPageElements.phoneNumberField).should('have.value', phoneNumber)
        cy.get(companyInfoPageElements.companyWebAddressField).should('have.value', companyWebAddress)
        cy.get(companyInfoPageElements.numberOfUsersField).should('have.value', numberOfUsers)
    })

})