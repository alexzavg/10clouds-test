import {signInPageElements} from '../../../../components/sign-in.js'
import {signUpPageElements, signUpPageData} from '../../../../components/sign-up.js'
import {dashboardPageElements} from '../../../../components/dashboard.js'
import {requests} from '../../../../components/requests.js'
import {emailsData} from '../../../../components/emailsData.js'
import {getRandomCharLength, getRandomNumberLength, getRandomSpecialCharLength, getCurrentTimeISO} from '../../../../support/dataGenerator.js'

const {generateToken} = require('authenticator')

describe('Sign Up', function() {

    const signUpLink            = Cypress.env('urls').signUp
    const confirmLink           = Cypress.env('urls').confirm
    const completeLink          = Cypress.env('urls').complete
    const serverId              = Cypress.env('MAILOSAUR_SERVER_ID')
    const emailDomain           = Cypress.env('email_domain')
    const firstName             = 'autotest' + getRandomCharLength(8)
    const email                 = 'autotest'+ getRandomCharLength(15) + getRandomNumberLength(5) + '@' + serverId + emailDomain
    const phoneNumber           = '+38067' + getRandomNumberLength(7)
    const personalUrl           = 'autotest' + getRandomCharLength(15)
    const taxNumber             = getRandomNumberLength(6)
    const numberOfEmployees     = getRandomNumberLength(1)
    const companyWebAddress     = 'https://' + getRandomCharLength(20) + '.com'
    const country               = 'Ukraine'
    const countryValue          = 'UA'
    const state                 = 'Poltavs\'ka Oblast\''
    const stateValue            = '53'
    const city                  = 'Poltava'
    const zip = getRandomNumberLength(6)
    const password              = getRandomCharLength(1).toUpperCase() + getRandomSpecialCharLength(1) + getRandomCharLength(3) + getRandomNumberLength(3)
    const invalidPasswordOne    = 'W1_wwww'
    const invalidPasswordTwo    = 'wwwwww_1'
    const invalidPasswordThree  = 'WWWWWW_1'
    const invalidPasswordFour   = 'wwwWWWW_'
    const invalidPasswordFive   = 'W1wwwwww'
    const testString            = 'autotest.com'
    const currentTime           = getCurrentTimeISO()
    const signInLink            = Cypress.config().baseUrl + '/' + personalUrl + '/sign-in'
    const prePaymentLink        = Cypress.config().baseUrl + '/' + personalUrl + '/payment/pre'
    const selectServicesLink    = Cypress.config().baseUrl + '/' + personalUrl + '/select-services'
    const dashboardLink         = Cypress.config().baseUrl + '/' + personalUrl + '/dashboard'
    const setupCompletedLink    = Cypress.config().baseUrl + '/' + personalUrl + '/setup-completed'

    let confirmationCode, otp

    beforeEach(() => {
        cy.intercept(requests['auth-cognito']).as('auth-cognito')
        cy.intercept(requests['sign-in']).as('sign-in')
        cy.intercept(requests['user-me']).as('user-me')
        cy.intercept(requests['customer-status']).as('customer-status')
        cy.intercept(requests['protection-scores']).as('protection-scores')
        cy.intercept(requests['customer-statistics']).as('customer-statistics')
        cy.intercept(requests['customer-top-statistics']).as('customer-top-statistics')
        cy.intercept(requests['catalog-items']).as('catalog-items')
        cy.intercept(requests['catalog-packages']).as('catalog-packages')
        cy.intercept(requests['service-licenses-order']).as('service-licenses-order')
        cy.intercept(requests['services']).as('services')
        cy.intercept(requests['service-licenses-policies']).as('service-licenses-policies')
        cy.intercept(requests['sign-up-api']).as('sign-up-api')
    })

    afterEach(() => {
        cy.clearCookies()
        cy.clearLocalStorage()
    })

    // ! disabled due to architecture issue with Amazon KMS
    // ! creating every new customer costs ~ $2
    // ! run this test manually only on demand
    // ! https://fortress-kok8877.slack.com/archives/C01EAKQB36H/p1622552019034200
    describe.skip('Create new customer', function() {

        it('Sign up as new customer', function() {
            
            cy.visit(signUpLink)
            cy.signUpStepOne(firstName, firstName, email, phoneNumber, personalUrl)
            cy.signUpStepTwo(personalUrl, taxNumber, numberOfEmployees, companyWebAddress)
            cy.signUpStepThree(country, countryValue, state, stateValue, city, zip)
            cy.signUpStepFour(password, password)

            // Create Customer / Company
            cy.contains(signUpPageElements.btn, signUpPageData.buttons.createAccount).click()
        
            cy.mailosaurGetMessage(serverId, {
                sentFrom: emailsData.emails.noReply,
                sentTo: email,
                subject: emailsData.subjects.emailVerification
            }, {
                receivedAfter: new Date(currentTime),
                timeout: 60000
            }).then(mail => {
                const body = mail.html.body
                confirmationCode = body.split('code: ')[1].slice(0,6) // get confirmation code from email
                cy.log('Confirmation code is', confirmationCode)

                cy.url().should('eq', confirmLink)
                cy.get(signUpPageElements.emailField).should('have.value', email)
                cy.get(signUpPageElements.confirmationCodeField).type(confirmationCode).should('have.value', confirmationCode)
                cy.contains(signUpPageElements.btn, signUpPageData.buttons.send).click()
            })

            cy.url().should('eq', completeLink)
            cy.contains(signUpPageData.initialSetupCompleted)
            cy.contains(signUpPageElements.btn, signUpPageData.buttons.signIn).click()

            cy.url().should('eq', signInLink)
            cy.signIn(email, password)

            cy.wait('@auth-cognito').its('response.statusCode').should('eq', 200)

            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.get('body').then((body) => {
                    if (body.find('.qrcode').length > 0) {
                        cy.log('2FA page seen')
                        cy.get(signInPageElements.otpTokenBlock).text().then((value) => {
                            otp = generateToken(value)
                            cy.log('New User Google OTP is:', otp)
                            let array = Array.from(otp)
            
                            cy.contains(signInPageElements.btn, signInPageData.buttons.next).click()
                            cy.fillOtp(array[0], array[1], array[2], array[3], array[4], array[5])
                        })
                    }
                    else {
                        cy.log('2FA page not seen')
                    }
                })
            })

            cy.wait('@sign-in').its('response.statusCode').should('eq', 200)
            cy.wait('@user-me').its('response.statusCode').should('eq', 200)
            cy.wait('@customer-status').its('response.statusCode').should('eq', 200)
            cy.wait('@customer-status').its('response.statusCode').should('eq', 200)
            cy.wait('@customer-status').its('response.statusCode').should('eq', 200)
            cy.wait('@catalog-items').its('response.statusCode').should('eq', 200)
            cy.wait('@catalog-packages').its('response.statusCode').should('eq', 200)

            cy.url().should('eq', prePaymentLink)
            cy.contains(signUpPageData.chooseSubscriptionPlan).should('be.visible')
            cy.get(signUpPageElements.monthlySubscription).click()
            cy.get(signUpPageElements.corePack1).click()
            cy.contains(signUpPageElements.btn, signUpPageData.buttons.next).click()
            cy.contains(signUpPageElements.btn, signUpPageData.buttons.next).click()
            cy.contains(signUpPageData.subscriptionPlanSummary).should('be.visible')
            cy.contains(signUpPageElements.btn, signUpPageData.buttons.proceedToPayment).click()

            cy.get(signUpPageElements.btnPayByCreditCard).click()
            cy.contains(signUpPageElements.btn, signUpPageData.buttons.continuePayment).click()

            cy.wait('@service-licenses-order').its('response.statusCode').should('eq', 201)
            cy.wait('@services').its('response.statusCode').should('eq', 200)
            cy.wait('@customer-status').its('response.statusCode').should('eq', 200)
            cy.wait('@customer-status').its('response.statusCode').should('eq', 200)

            cy.url().should('eq', selectServicesLink)

            // EDP service setup
            cy.get(signUpPageElements.highPolicyRadioBtn).click()
            cy.contains(signUpPageElements.btn, signUpPageData.buttons.next).click()

            // MAIL service setup
            cy.get(signUpPageElements.gSuiteRadioBtnMail).click() // Gsuite
            cy.get(signUpPageElements.emailDomainsField).type(testString)
            cy.get(signUpPageElements.euRadioBtnMail).click() // EU
            cy.get(signUpPageElements.smtpServersField).type(testString)
            cy.contains(signUpPageElements.btn, signUpPageData.buttons.next).click()

            // CLOUD STORAGE service setup
            cy.get(signUpPageElements.gSuiteRadioBtnCloud).click() // Gsuite
            cy.get(signUpPageElements.cloudEnvironmentField).type(testString)
            cy.get(signUpPageElements.euRadioBtnCloud).click() // EU
            cy.get(signUpPageElements.storageProvider.dropdown).click()
            cy.contains(signUpPageElements.storageProvider.option, signUpPageData.googleDrive).click()
            cy.clickOutside()
            cy.contains(signUpPageElements.btn, signUpPageData.buttons.apply).click()

            // [Setup Completed] screen
            cy.url().should('eq', setupCompletedLink)
            cy.contains(signUpPageElements.btn, signUpPageData.buttons.enterTheSystem).click()

            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@service-licenses-policies').its('response.statusCode').should('eq', 200)
                cy.wait('@protection-scores').its('response.statusCode').should('eq', 200)
                cy.wait('@customer-statistics').its('response.statusCode').should('eq', 200)
                cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200)
                cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200)
                cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200)
        
                cy.get(dashboardPageElements.scoreValue).should('be.visible')
                cy.url().should('eq', dashboardLink)
            })
        })

    })

    describe('Errors validation for [Step 1]', function() {

        it('Check empty fields validation', function() {
            cy.visit(signUpLink)

            cy.get(signUpPageElements.firstNameField).click()
            cy.clickOutside()
            cy.contains(signInPageElements.error, signUpPageData.errors.firstNameRequired).should('be.visible')

            cy.get(signUpPageElements.lastNameField).click()
            cy.clickOutside()
            cy.contains(signInPageElements.error, signUpPageData.errors.lastNameRequired).should('be.visible')

            cy.get(signUpPageElements.emailField).click()
            cy.clickOutside()
            cy.contains(signInPageElements.error, signUpPageData.errors.emailRequired).should('be.visible')

            cy.get(signUpPageElements.phoneNumberField).click()
            cy.clickOutside()
            cy.contains(signInPageElements.error, signUpPageData.errors.invalidPhone).should('be.visible')

            cy.get(signUpPageElements.personalUrlField).click()
            cy.clickOutside()
            cy.contains(signInPageElements.error, signUpPageData.errors.personalUrlRequired).should('be.visible')

            cy.contains(signInPageElements.btnDisabled, signUpPageData.buttons.continue).should('be.visible')
        })

        it('Check invalid email in [Email] field', function() {
            cy.visit(signUpLink)
            cy.get(signUpPageElements.emailField).type('invalidEmail')
            cy.clickOutside()
            cy.contains(signInPageElements.error, signUpPageData.errors.emailInvalid).should('be.visible')
        })

        it('Check invalid email in [Phone] field', function() {
            cy.visit(signUpLink)
            cy.get(signUpPageElements.phoneNumberField).type('+38099999')
            cy.clickOutside()
            cy.contains(signInPageElements.error, signUpPageData.errors.invalidPhone).should('be.visible')
        })
    })

    describe('Errors validation for [Step 2]', function() {

        it('Check empty fields validation', function() {
            cy.visit(signUpLink)
            cy.signUpStepOne(firstName, firstName, email, phoneNumber, personalUrl)

            cy.get(signUpPageElements.companyNameField).click()
            cy.clickOutside()
            cy.contains(signInPageElements.error, signUpPageData.errors.companyNameRequired).should('be.visible')

            cy.get(signUpPageElements.numberOfEmployeesField).click()
            cy.clickOutside()
            cy.contains(signInPageElements.error, signUpPageData.errors.numberOfUsersRequired).should('be.visible')

            cy.get(signUpPageElements.companyWebAddressField).click()
            cy.clickOutside()
            cy.contains(signInPageElements.error, signUpPageData.errors.companyWebAddressRequired).should('be.visible')

            cy.contains(signInPageElements.btnDisabled, signUpPageData.buttons.continue).should('be.visible')
        })

        it('Check that [Number of Employees] field accepts min value [1]', function() {
            cy.visit(signUpLink)
            cy.signUpStepOne(firstName, firstName, email, phoneNumber, personalUrl)

            cy.get(signUpPageElements.numberOfEmployeesField).clear().type('1')
            cy.clickOutside()
            cy.contains(signInPageElements.error, signUpPageData.errors.numberOfUsersInvalidRange).should('not.exist')
        })

        it('Check that [Number of Employees] field accepts max value [9999]', function() {
            cy.get(signUpPageElements.numberOfEmployeesField).clear().type('9999')
            cy.clickOutside()
            cy.contains(signInPageElements.error, signUpPageData.errors.numberOfUsersInvalidRange).should('not.exist')
        })

        it('Check that [Number of Employees] field doesn\'t accept value [-1]', function() {
            cy.get(signUpPageElements.numberOfEmployeesField).clear().type('-1')
            cy.clickOutside()
            cy.contains(signInPageElements.error, signUpPageData.errors.numberOfUsersInvalidRange).should('be.visible')
        })

        it('Check that [Number of Employees] field doesn\'t accept value [0]', function() {
            cy.get(signUpPageElements.numberOfEmployeesField).clear().type('0')
            cy.clickOutside()
            cy.contains(signInPageElements.error, signUpPageData.errors.numberOfUsersInvalidRange).should('be.visible')
        })

        it('Check that [Number of Employees] field doesn\'t accept value [10000]', function() {
            cy.get(signUpPageElements.numberOfEmployeesField).clear().type('10000')
            cy.clickOutside()
            cy.contains(signInPageElements.error, signUpPageData.errors.numberOfUsersInvalidRange).should('be.visible')
        })

        it('Check error for characters in [Number of Employees] field', function() {
            cy.get(signUpPageElements.numberOfEmployeesField).clear().type('abc')
            cy.clickOutside()
            cy.contains(signInPageElements.error, signUpPageData.errors.numberOfUsersRequired).should('be.visible')
        })

        it('Check error for special characters in [Number of Employees] field', function() {
            cy.get(signUpPageElements.numberOfEmployeesField).clear().type('!@#$%^&*()_')
            cy.clickOutside()
            cy.contains(signInPageElements.error, signUpPageData.errors.numberOfUsersRequired).should('be.visible')
        })
    })

    describe('Errors validation for [Step 3]', function() {

        it('Check empty fields validation', function() {
            cy.visit(signUpLink)
            cy.signUpStepOne(firstName, firstName, email, phoneNumber, personalUrl)
            cy.signUpStepTwo(personalUrl, taxNumber, numberOfEmployees, companyWebAddress)

            cy.get(signUpPageElements.countryDropdown).select('')
            cy.clickOutside()
            cy.contains(signInPageElements.error, signUpPageData.errors.countryRequired).should('be.visible')

            cy.get(signUpPageElements.countryDropdown).select(country).should('have.value', countryValue)
            cy.get(signUpPageElements.stateDropdown).select('')
            cy.clickOutside()
            cy.contains(signInPageElements.error, signUpPageData.errors.stateRequired).should('be.visible')

            cy.get(signUpPageElements.cityField).click()
            cy.clickOutside()
            cy.contains(signInPageElements.error, signUpPageData.errors.cityRequired).should('be.visible')
            
            cy.get(signUpPageElements.zipField).click()
            cy.clickOutside()
            cy.contains(signInPageElements.error, signUpPageData.errors.zipRequired).should('be.visible')
        })

    })

    describe('Errors validation for [Step 4]', function() {

        it('Check empty fields validation', function() {
            cy.visit(signUpLink)
            cy.signUpStepOne(firstName, firstName, email, phoneNumber, personalUrl)
            cy.signUpStepTwo(personalUrl, taxNumber, numberOfEmployees, companyWebAddress)
            cy.signUpStepThree(country, countryValue, state, stateValue, city, zip)

            cy.get(signUpPageElements.passwordField).click()
            cy.clickOutside()
            cy.contains(signInPageElements.error, signUpPageData.errors.passwordRequired).should('be.visible')

            cy.get(signUpPageElements.confirmPasswordField).click()
            cy.clickOutside()
            cy.contains(signInPageElements.error, signUpPageData.errors.confirmPasswordRequired).should('be.visible')

            cy.contains(signInPageElements.btnDisabled, signUpPageData.buttons.createAccount).should('be.visible')
        })

        it('Check [Password Requirements] popup', function() {
            cy.get(signUpPageElements.passwordField).clear().type(password)
            cy.get('.icon.checked').its('length').should('eq', 5)
            cy.get('.icon.checked').should('be.visible')
        })

        it('[Password] & [Confirm Password] don\'t match', function() {
            cy.signUpStepFour(password, password+' ')
            cy.contains(signInPageElements.error, signUpPageData.errors.passwordsDontMatch).should('be.visible')
        })

        it('[Password] doesn\'t meet requirement [At least 8 characters]', function() {
            cy.get(signUpPageElements.passwordField).clear().type(invalidPasswordOne)
            cy.contains(signInPageElements.error, signUpPageData.errors.passwordInvalidLength).should('be.visible')
        })

        it('[Password] doesn\'t meet requirement [At least one uppercase character]', function() {
            cy.signUpStepFour(invalidPasswordTwo, invalidPasswordTwo)
            cy.contains(signUpPageElements.btn, signUpPageData.buttons.createAccount).click()
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@sign-up-api').its('response.statusCode').should('eq', 400)
                cy.contains(signInPageElements.error, signUpPageData.errors.passwordRequirements).should('be.visible')
            })
        })

        it('[Password] doesn\'t meet requirement [At least one lowercase character]', function() {
            cy.signUpStepFour(invalidPasswordThree, invalidPasswordThree)
            cy.contains(signUpPageElements.btn, signUpPageData.buttons.createAccount).click()
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@sign-up-api').its('response.statusCode').should('eq', 400)
                cy.contains(signInPageElements.error, signUpPageData.errors.passwordRequirements).should('be.visible')
            })
        })

        it('[Password] doesn\'t meet requirement [At least one digit character]', function() {
            cy.signUpStepFour(invalidPasswordFour, invalidPasswordFour)
            cy.contains(signUpPageElements.btn, signUpPageData.buttons.createAccount).click()
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@sign-up-api').its('response.statusCode').should('eq', 400)
                cy.contains(signInPageElements.error, signUpPageData.errors.passwordRequirements).should('be.visible')
            })
        })

        it('[Password] doesn\'t meet requirement [At least one special character]', function() {
            cy.signUpStepFour(invalidPasswordFive, invalidPasswordFive)
            cy.contains(signUpPageElements.btn, signUpPageData.buttons.createAccount).click()
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@sign-up-api').its('response.statusCode').should('eq', 400)
                cy.contains(signInPageElements.error, signUpPageData.errors.passwordRequirements).should('be.visible')
            })
        })

    })

})