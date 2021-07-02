import {signInPageElements, signInPageData} from '../../../../components/sign-in.js'
import {signUpPageElements} from '../../../../components/sign-up.js'
import {requests} from '../../../../components/requests.js'
import {emailsData} from '../../../../components/emailsData.js'
import {getRandomCharLength, getRandomNumberLength, getRandomSpecialCharLength, getCurrentTimeISO} from '../../../../support/dataGenerator.js'

describe('Restore Password', function() {

    const signInLink            = Cypress.env('urls').signIn
    const forgotPasswordLink    = Cypress.env('urls').restorePassword
    const companyName           = Cypress.env('customers').first.name
    const email                 = Cypress.env('users').sixth.email
    const firstName             = Cypress.env('users').sixth.firstName
    const lastName              = Cypress.env('users').sixth.lastName
    const invalidEmail          = email.replace('@', '@@')
    const newPassword           = getRandomCharLength(1).toUpperCase() + getRandomSpecialCharLength(1) + getRandomCharLength(3) + getRandomNumberLength(3)
    const currentTime           = getCurrentTimeISO()
    const serverId              = Cypress.env('MAILOSAUR_SERVER_ID')
    const incorrectCode         = '000000'

    beforeEach(() => {
        cy.intercept(requests['auth-cognito']).as('auth-cognito')
        cy.intercept(requests['sign-in']).as('sign-in')
        cy.intercept(requests['user-password-reset']).as('user-password-reset')
        cy.intercept(requests['user-password-change']).as('user-password-change')
    })
  
    it('Restore password, check email & login with new password', function() {
        cy.visit(signInLink)
        cy.get(signInPageElements.forgotPasswordBtn).click()

        cy.url().should('eq', forgotPasswordLink)
        cy.get(signInPageElements.emailField).type(email)
        cy.contains(signInPageElements.btn, signInPageData.buttons.restorePassword).click()

        cy.wait('@user-password-reset').then((value) => {
            // Request
            expect(value.request.method).to.eq('POST')
            expect(value.request.body.email).to.eq(email)
            expect(value.request.body.siteUrl).to.eq(companyName)
            // Response
            expect(value.response.statusCode).to.eq(201)
            expect(value.response.body.email).to.eq(email)
            expect(value.response.body.siteUrl).to.eq(companyName)
        })
        
        cy.mailosaurGetMessage(serverId, {
            sentFrom: emailsData.emails.support,
            sentTo: email,
            subject: emailsData.subjects.resetUserPassword
        }, {
            receivedAfter: new Date(currentTime),
            timeout: 60000
        }).then(mail => {
            const body = mail.text.body
            // ! disabled due to bug https://qfortress.atlassian.net/browse/FORT-573
            // expect(body).to.contain(firstName)
            // expect(body).to.contain(lastName)
            let confirmationCode = body.split('following verification code\n\n')[1].slice(0,6)
            cy.log(confirmationCode)

            cy.get(signInPageElements.confirmEmailField).should('have.value', email)
            cy.get(signInPageElements.confirmCodeField).type(confirmationCode)
            cy.get(signInPageElements.newPasswordField).type(newPassword)
            cy.get(signInPageElements.confirmPasswordField).type(newPassword)
            cy.contains(signInPageElements.btn, signInPageData.buttons.confirm).click()

            cy.wait('@user-password-change').then((value) => {
                // Request
                expect(value.request.method).to.eq('POST')
                expect(value.request.body.email).to.eq(email)
                expect(value.request.body.newPassword).to.eq(newPassword)
                expect(value.request.body.siteUrl).to.eq(companyName)
                expect(value.request.body.verificationCode).to.eq(confirmationCode)
                // Response
                expect(value.response.statusCode).to.eq(201)
                expect(value.response.body.email).to.eq(email)
                expect(value.response.body.siteUrl).to.eq(companyName)
            })

            cy.url().should('eq', signInLink)
            cy.signIn(email, newPassword)

            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.contains(signInPageData.verificationCode).should('be.visible')
                cy.wait('@auth-cognito').its('response.statusCode').should('eq', 200)
            })
        })
    })

    it('Error for empty [Email] field', function() {
        cy.visit(forgotPasswordLink)
        cy.get(signInPageElements.emailField).click()
        cy.clickOutside()
        cy.contains(signInPageElements.error, signInPageData.errors.emailRequired).should('be.visible')
        cy.contains(signInPageElements.btnDisabled, signInPageData.buttons.restorePassword).should('be.visible')
    })

    it('Error for invalid email in [Email] field', function() {
        cy.visit(forgotPasswordLink)
        cy.get(signInPageElements.emailField).type(invalidEmail)
        cy.contains(signInPageElements.btn, signInPageData.buttons.restorePassword).click()
        cy.contains(signInPageElements.notificationDialogue, `Email ${invalidEmail} is not valid`)
        cy.url().should('eq', forgotPasswordLink)
        cy.wait('@user-password-reset').then((value) => {
            // Request
            expect(value.request.method).to.eq('POST')
            expect(value.request.body.email).to.eq(invalidEmail)
            expect(value.request.body.siteUrl).to.eq(companyName)
            // Response
            expect(value.response.statusCode).to.eq(400)
        })
    })

    it('Error for [New Password] & [Confirm Password] field values mismatch', function() {
        cy.visit(forgotPasswordLink)
        cy.get(signInPageElements.emailField).type(email)
        cy.contains(signInPageElements.btn, signInPageData.buttons.restorePassword).click()
        cy.get(signInPageElements.emailField).should('have.value', email)
        cy.get(signInPageElements.newPasswordField).clear().type('1')
        cy.get(signInPageElements.confirmPasswordField).clear().type('2')
        cy.contains(signInPageElements.error, signInPageData.errors.passwordsDontMatch).should('be.visible')
        cy.contains(signInPageElements.btnDisabled, signInPageData.buttons.confirm).should('be.visible')
    })

    it('Error for empty [Code] field', function() {
        cy.get(signInPageElements.confirmCodeField).click()
        cy.clickOutside()
        cy.contains(signInPageElements.error, signInPageData.errors.codeIsRequired).should('be.visible')
    })

    it('Error for incorrect code in [Code] field', function() {
        cy.get(signInPageElements.newPasswordField).clear().type(newPassword)
        cy.get(signInPageElements.confirmPasswordField).clear().type(newPassword)
        cy.get(signInPageElements.confirmCodeField).clear().type(incorrectCode)
        cy.contains(signInPageElements.btn, signInPageData.buttons.confirm).click()
        cy.wait('@user-password-change').then((value) => {
            // Request
            expect(value.request.method).to.eq('POST')
            expect(value.request.body.email).to.eq(email)
            expect(value.request.body.siteUrl).to.eq(companyName)
            expect(value.request.body.verificationCode).to.eq(incorrectCode)
            // Response
            expect(value.response.statusCode).to.eq(400)
            expect(value.response.body.code).to.eq(signInPageData.errors.codeMismatchException)
            expect(value.response.body.message).to.eq(signInPageData.errors.invalidCodeProvided)
            expect(value.response.body.name).to.eq(signInPageData.errors.codeMismatchException)
        })
    })
 
 })