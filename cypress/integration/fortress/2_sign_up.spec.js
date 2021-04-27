import {signUpPage} from '../../pages/sign-up.js';
import {signInPage} from '../../pages/sign-in.js';
import {dashboardPage} from '../../pages/dashboard.js';
import {requests} from '../../support/requests.js';
import {
    getRandomCharLength, 
    getRandomNumberLength, 
    getCurrentTimeISO
} from '../../support/dataGenerator.js';

describe('Sign Up New Customer', function() {

    const signUpLink = Cypress.env('urls').signUp;
    const confirmLink = Cypress.env('urls').confirm;
    const completeLink = Cypress.env('urls').complete;
    const serverId = Cypress.env('MAILOSAUR_SERVER_ID');

    const firstName = 'test' + getRandomCharLength(8);
    const email = getRandomCharLength(15) + getRandomNumberLength(5) + '@' + serverId + '.mailosaur.net';
    const phoneNumber = '+38067' + getRandomNumberLength(7);
    const personalUrl = 'test' + getRandomCharLength(15);
    const taxNumber = getRandomNumberLength(6);
    const numberOfEmployees = getRandomNumberLength(1);
    const companyWebAddress = 'https://' + getRandomCharLength(20) + '.com';
    const country = 'Ukraine';
    const state = 'Poltavs\'ka Oblast\'';
    const city = 'Poltava';
    const zip = getRandomNumberLength(6);
    const password = getRandomCharLength(4) + getRandomNumberLength(4);

    const currentTime = getCurrentTimeISO();

    const signInLink = Cypress.config().baseUrl + '/' + personalUrl + '/sign-in';
    const prePaymentLink = Cypress.config().baseUrl + '/' + personalUrl + '/payment/pre';
    const selectServicesLink = Cypress.config().baseUrl + '/' + personalUrl + '/select-services';
    const dashboardLink = Cypress.config().baseUrl + '/' + personalUrl + '/dashboard';

    let confirmationCode;

    it('should sign up as new customer', function() {

        cy.intercept('/auth/cognito-pool-settings?siteUrl=' + personalUrl).as('auth-cognito');
        cy.intercept(requests['sign-in']).as('sign-in');
        cy.intercept(requests['user-me']).as('user-me');
        cy.intercept(requests['customer-status']).as('customer-status');
        cy.intercept(requests['protection-scores']).as('protection-scores');
        cy.intercept(requests['catalog-items']).as('catalog-items');
        cy.intercept(requests['catalog-packages']).as('catalog-packages');
        cy.intercept(requests['service-licenses-order']).as('service-licenses-order');
        cy.intercept(requests['services']).as('services');
        cy.intercept(requests['service-licenses-policies']).as('service-licenses-policies');
        
        cy.visit(signUpLink);

        cy.get(signUpPage.firstNameField).type(firstName).should('have.value', firstName);
        cy.get(signUpPage.lastNameField).type(firstName).should('have.value', firstName);
        cy.get(signUpPage.emailField).type(email).should('have.value', email);
        cy.get(signUpPage.phoneNumberField).type(phoneNumber).should('have.value', phoneNumber);
        cy.get(signUpPage.personalUrlField).type(personalUrl).should('have.value', personalUrl);
        cy.get(signUpPage.btnContinueStep1).click();
    
        cy.get(signUpPage.companyNameField).type(personalUrl).should('have.value', personalUrl);
        cy.get(signUpPage.taxNumberField).type(taxNumber).should('have.value', taxNumber);
        cy.get(signUpPage.numberOfEmployeesField).type(numberOfEmployees).should('have.value', numberOfEmployees);
        cy.get(signUpPage.companyWebAddressField).type(companyWebAddress).should('have.value', companyWebAddress);
        cy.get(signUpPage.btnContinueStep2).click();
    
        cy.get(signUpPage.countryDropdown).select(country).should('have.value', 'UA');
        cy.get(signUpPage.stateDropdown).select(state).should('have.value', '53');
        cy.get(signUpPage.cityField).type(city).should('have.value', city);
        cy.get(signUpPage.zipField).type(zip).should('have.value', zip);
        cy.get(signUpPage.btnContinueStep3).click();
    
        cy.get(signUpPage.passwordField).type(password);
        cy.get(signUpPage.confirmPasswordField).type(password);
        cy.get(signUpPage.btnContinueStep4).click();
    
        cy.mailosaurGetMessage(serverId, {
            sentFrom: 'no-reply@verificationemail.com',
            sentTo: email,
            subject: 'Fortress - Email verification'
        }, {
            receivedAfter: new Date(currentTime),
            timeout: 60000
        }).then(mail => {
            const body = mail.html.body;
            confirmationCode = body.split('code: ')[1].slice(0,6); // get confirmation code from email
            cy.log('Confirmation code is', confirmationCode);

            cy.url().should('eq', confirmLink);
            cy.get(signUpPage.emailField).should('have.value', email);
            cy.get(signUpPage.confirmationCodeField).type(confirmationCode).should('have.value', confirmationCode);
            cy.get(signUpPage.btnSendConfirmationCode).click();
        });

        cy.url().should('eq', completeLink);
        cy.contains('Initial account setup has been completed');
        cy.get(signUpPage.btnSignIn).click();

        cy.url().should('eq', signInLink);
        cy.get(signInPage.loginField).type(email);
        cy.get(signInPage.passwordField).type(password);
        cy.get(signInPage.btnSignInFirst).click();

        cy.wait('@auth-cognito').its('response.statusCode').should('eq', 200);
        cy.wait('@sign-in').its('response.statusCode').should('eq', 200);
        cy.wait('@user-me').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-status').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-status').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-status').its('response.statusCode').should('eq', 200);
        cy.wait('@catalog-items').its('response.statusCode').should('eq', 200);
        cy.wait('@catalog-packages').its('response.statusCode').should('eq', 200);

        cy.url().should('eq', prePaymentLink);
        cy.contains('Choose Your Subscription Plan').should('be.visible');
        cy.get(signUpPage.monthlySubscription).click();
        cy.get(signUpPage.corePack1).click();
        cy.get(signUpPage.btnNextFirst).click();
        cy.get(signUpPage.btnNextSecond).click();
        cy.contains('Subscription Plan Summary').should('be.visible');
        cy.get(signUpPage.btnNextSecond).click();

        cy.get(signUpPage.btnPayByCreditCard).click();
        cy.get(signUpPage.btnNextSecond).click();

        cy.wait('@service-licenses-order').its('response.statusCode').should('eq', 201);
        cy.wait('@services').its('response.statusCode').should('eq', 200);

        cy.url().should('eq', selectServicesLink);
        cy.contains('End Point').should('be.visible');
        cy.contains('Mail').should('be.visible');
        cy.contains('Cloud Storage').should('be.visible');
        cy.get(signUpPage.highPolicyRadioBtn).click();
        cy.get(signUpPage.btnApply).click();

        cy.wait('@service-licenses-policies').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-status').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-status').its('response.statusCode').should('eq', 200);
        cy.wait('@protection-scores').its('response.statusCode').should('eq', 200);

        cy.get(dashboardPage.scoreValue).should('be.visible');
        cy.url().should('eq', dashboardLink);

    });

});